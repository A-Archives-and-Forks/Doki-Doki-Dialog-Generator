export function lazy<T>(getter: () => Promise<T>): () => Promise<T> {
	let value: T | null = null;
	return async () => {
		if (value == null) {
			value = await getter();
		}
		return value;
	};
}
