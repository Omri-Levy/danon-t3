import { HTMLProps } from 'react';

export interface IEditableInputProps<TValue = string>
	extends HTMLProps<HTMLInputElement> {
	initialValue: TValue;
	onEdit?: (value: TValue) => void;
}
