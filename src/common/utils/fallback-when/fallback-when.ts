export const fallbackWhen = (
	value: any,
	fallback: any,
	when: boolean,
) => (when ? fallback : value);
