export const toTitleCase = (str: string) =>
	str
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, (str) => str.toUpperCase());
