import { DuplicateEntryError } from './interfaces';

export const isDuplicateEntryError = (
	error: unknown,
): error is DuplicateEntryError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as Record<string, unknown>).code === 'ER_DUP_ENTRY'
	);
};
