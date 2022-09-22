import { AnyArray } from '../../types';
import { useEffect } from 'react';

export const useConsole = <TValues extends AnyArray>(
	...values: TValues
) => {
	useEffect(() => {
		console.log(...values);
	}, [values]);
};
