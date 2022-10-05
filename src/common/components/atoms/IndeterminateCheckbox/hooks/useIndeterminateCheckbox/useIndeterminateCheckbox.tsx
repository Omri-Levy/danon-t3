import { useEffect, useRef } from 'react';

export const useIndeterminateCheckbox = (
	checked: boolean,
	indeterminate?: boolean,
) => {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (typeof indeterminate !== 'boolean' || !ref.current) {
			return;
		}

		ref.current.indeterminate = !checked && indeterminate;
	}, [ref, indeterminate]);

	return {
		ref,
	};
};
