import {
	ChangeEvent,
	FunctionComponent,
	KeyboardEventHandler,
	useRef,
	useState,
} from 'react';
import { IEditableInputProps } from './interfaces';

export const EditableInput: FunctionComponent<
	IEditableInputProps
> = ({ initialValue, onEdit, ...props }) => {
	const ref = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState(initialValue);
	const onChange = (e: ChangeEvent<HTMLInputElement>) =>
		setValue(e.target.value);
	const resetValue = () => setValue(initialValue);
	const onKeyDown: KeyboardEventHandler<HTMLInputElement> = async (
		e,
	) => {
		switch (e.key) {
			case 'Enter':
				await onEdit?.(value);
				ref.current?.blur();
				break;
			case 'Escape':
				resetValue();
				ref.current?.blur();
				break;
			default:
				break;
		}
	};

	return (
		<input
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
