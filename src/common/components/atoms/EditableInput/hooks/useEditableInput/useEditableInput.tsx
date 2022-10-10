import { IEditableInputProps } from '../../interfaces';
import {
	ChangeEvent,
	KeyboardEventHandler,
	useCallback,
	useRef,
	useState,
} from 'react';

export const useEditableInput = (
	initialValue: IEditableInputProps['initialValue'],
	onEdit: IEditableInputProps['onEdit'],
) => {
	const ref = useRef<HTMLInputElement>(null);
	const [value, setValue] = useState(initialValue);
	const onChange = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			setValue(e.target.value);
		},
		[setValue, value, initialValue],
	);
	const resetValue = useCallback(() => {
		if (value === initialValue) return;

		setValue(initialValue);
	}, [setValue, initialValue, value]);
	const onKeyDown: KeyboardEventHandler<HTMLInputElement> =
		useCallback(
			async (e) => {
				switch (e.key) {
					case 'Enter':
						if (value === initialValue) return;

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
			},
			[value, initialValue, onEdit, ref.current?.blur],
		);

	return {
		ref,
		value,
		onChange,
		onKeyDown,
		resetValue,
	};
};
