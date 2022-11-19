import { FunctionComponent } from 'react';
import { IEditableInputProps } from './interfaces';
import { useEditableInput } from './hooks/useEditableInput/useEditableInput';

export const EditableInput: FunctionComponent<
	IEditableInputProps
> = ({ initialValue, onEdit, isCurrency, isEditable, ...props }) => {
	const { value, onChange, onKeyDown, resetValue, ref } =
		useEditableInput(initialValue, onEdit);

	return (
		<div className='form-control'>
			<label className='input-group input-group-md'>
				{isCurrency && <span>₪</span>}
				<input
					disabled={!isEditable}
					dir={`auto`}
					className={`bg-transparent pl-1 uneditable`}
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					onBlur={resetValue}
					ref={ref}
					{...props}
				/>
			</label>
		</div>
	);
};
