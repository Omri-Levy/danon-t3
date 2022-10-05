import { FunctionComponent } from 'react';
import { useIndeterminateCheckbox } from './hooks/useIndeterminateCheckbox/useIndeterminateCheckbox';
import { IIndeterminateCheckboxProps } from './interfaces';

export const IndeterminateCheckbox: FunctionComponent<
	IIndeterminateCheckboxProps
> = ({ indeterminate, ...rest }) => {
	const { ref } = useIndeterminateCheckbox(
		!!rest?.checked,
		indeterminate,
	);

	return (
		<input
			className={`checkbox`}
			type='checkbox'
			ref={ref}
			{...rest}
		/>
	);
};
