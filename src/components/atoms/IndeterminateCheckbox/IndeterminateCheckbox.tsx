import { HTMLProps, useEffect, useRef } from 'react';

export const IndeterminateCheckbox = ({
	indeterminate,
	...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
	const ref = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (typeof indeterminate === 'boolean' && ref.current) {
			ref.current.indeterminate =
				!rest.checked && indeterminate;
		}
	}, [ref, indeterminate]);

	return (
		<input
			className={`checkbox`}
			type='checkbox'
			ref={ref}
			{...rest}
		/>
	);
};
