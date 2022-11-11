import { env } from '../../env/server.mjs';
import { IDuplicateEntryError } from './interfaces';
import { isObject } from '../is-object/is-object';

export const isDuplicateEntryError = (
	error: unknown,
): error is IDuplicateEntryError => {
	if (env.NODE_ENV !== 'production') {
		return (
			isObject(error) &&
			'code' in error &&
			(error as Record<string, unknown>).code ===
				'ER_DUP_ENTRY' &&
			typeof (error as Record<string, unknown>).sqlMessage ===
				'string'
		);
	}

	return (
		isObject(error) &&
		'body' in error &&
		'message' in error.body &&
		(
			error as {
				body: {
					message: string;
				};
			}
		).body.message.includes('code = AlreadyExists') &&
		typeof (
			error as {
				body: Record<PropertyKey, unknown>;
			}
		).body.message === 'string'
	);
};
