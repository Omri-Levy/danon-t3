import { removeDuplicateSpaces } from '../remove-duplicate-spaces/remove-duplicate-spaces';

export const normalizeSpace = (str: string) => {
	if (typeof str !== 'string') return str;

	return removeDuplicateSpaces(str).trim();
};
