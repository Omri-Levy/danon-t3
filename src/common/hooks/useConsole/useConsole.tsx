import { TAnyArray } from '../../types';
import { useEffect } from 'react';

export const useConsole = <TValues extends TAnyArray>(
	...values: TValues
) => {
	useEffect(() => {
		console.log(...values);
	}, [values]);
};
