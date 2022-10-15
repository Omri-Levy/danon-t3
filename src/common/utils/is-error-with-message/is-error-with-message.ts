import { IErrorWithMessage } from './interfaces';
import { isObject } from '../is-object/is-object';

export const isErrorWithMessage = (
	error: unknown,
): error is IErrorWithMessage => {
	return (
		isObject(error) &&
		'message' in error &&
		typeof (error as Record<string, unknown>).message === 'string'
	);
};
