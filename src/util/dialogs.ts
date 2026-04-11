import eventBus, {
	DialogResponseEvent,
	ShowDialogEvent,
} from '@/eventbus/event-bus';

export async function confirm(text: string): Promise<boolean> {
	const response = await dialog(text, ['Yes', 'No'], 'No');
	return response === 'Yes';
}

const dialogsWaiting = new Map<number, (response: string) => void>();
let nextDialogId = 0;

export function dialog(
	text: string,
	options: string[],
	closeOption: string
): Promise<string> {
	const dialogId = nextDialogId;
	const { promise, resolve } = Promise.withResolvers<string>();
	dialogsWaiting.set(dialogId, resolve);

	eventBus.fire(new ShowDialogEvent(dialogId, text, options, closeOption));
	nextDialogId++;
	if (nextDialogId > Number.MAX_SAFE_INTEGER) {
		console.warn(
			`Dialog number wrap-around. What in the world are you doing???`
		);
		nextDialogId = 0;
	}
	return promise;
}

eventBus.subscribe(DialogResponseEvent, (event: DialogResponseEvent) => {
	const waiting = dialogsWaiting.get(event.id);
	if (waiting) {
		waiting(event.result);
		dialogsWaiting.delete(event.id);
	} else {
		console.error(new Error('Got dialog response for unknown dialog'));
	}
});
