export const removeDuplicateSpaces = (str: string) => {
	if (typeof str !== 'string') return str;

	return str.replace(/\s\s+/g, ' ');
};
