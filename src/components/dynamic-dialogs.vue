<!--
	UI counterpart to utils/dialogs.ts.
	Provides a mechanism for any code anywhere to trigger dialog boxes without needing to interact directly with vue.
-->

<template>
	<teleport to="#modal-messages" v-for="dialog in openDialogs" :key="dialog.id">
		<modal-dialog
			:options="['No', 'Yes']"
			no-base-size
			class="modal-rename"
			@option="confirmOption(dialog.id, $event)"
			@leave="confirmOption(dialog.id, dialog.closeOption)"
		>
			<p class="modal-text">{{ dialog.text }}</p>
		</modal-dialog>
	</teleport>
</template>

<script lang="ts" setup>
import eventBus, {
	DialogResponseEvent,
	ShowDialogEvent,
} from '@/eventbus/event-bus';
import { ref } from 'vue';
import ModalDialog from './modal-dialog.vue';

const openDialogs = ref([] as ShowDialogEvent[]);

function confirmOption(id: number, result: string) {
	const idx = openDialogs.value.findIndex((d) => d.id === id);
	if (idx === -1) return;
	eventBus.fire(new DialogResponseEvent(id, result));
	openDialogs.value.splice(idx, 1);
}

eventBus.subscribe(ShowDialogEvent, (event: ShowDialogEvent) => {
	openDialogs.value.push(event);
});
</script>

<style>
.modal-rename {
	padding: 1em !important;
}

.modal-text {
	padding-bottom: 1em;
}
</style>
