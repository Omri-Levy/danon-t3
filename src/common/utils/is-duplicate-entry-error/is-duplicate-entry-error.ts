import { IDuplicateEntryError } from './interfaces';

export const isDuplicateEntryError = (
	error: unknown,
): error is IDuplicateEntryError => {
	return (
		typeof error === 'object' &&
		error !== null &&
		'code' in error &&
		(error as Record<string, unknown>).code === 'ER_DUP_ENTRY' &&
		typeof (error as Record<string, unknown>).sqlMessage ===
			'string'
	);
};
