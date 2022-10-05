import { FunctionComponent } from 'react';
import { IEditableInputProps } from './interfaces';
import { useEditableInput } from './hooks/useEditableInput/useEditableInput';

export const EditableInput: FunctionComponent<
	IEditableInputProps
> = ({ initialValue, onEdit, ...props }) => {
	const { value, onChange, onKeyDown, resetValue, ref } =
		useEditableInput(initialValue, onEdit);

	return (
		<input
			dir={`auto`}
			className={`bg-transparent pl-1`}
			value={value}
			onChange={onChange}
			onKeyDown={onKeyDown}
			onBlur={resetValue}
			ref={ref}
			{...props}
		/>
	);
};
