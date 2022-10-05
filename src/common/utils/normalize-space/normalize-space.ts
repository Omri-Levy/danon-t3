import { removeDuplicateSpaces } from '../remove-duplicate-spaces/remove-duplicate-spaces';

export const normalizeSpace = (str: string) => {
	return removeDuplicateSpaces(str).trim();
};
