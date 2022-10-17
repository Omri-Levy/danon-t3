import { TAnyArray } from '../../types';

export const isInstanceOfFunction = (
	value: any,
): value is (...args: TAnyArray) => any => value instanceof Function;
