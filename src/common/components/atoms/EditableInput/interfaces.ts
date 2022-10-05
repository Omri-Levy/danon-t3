import { HTMLProps } from 'react';

export interface IEditableInputProps
	extends HTMLProps<HTMLInputElement> {
	initialValue: string;
	onEdit?: (value: string) => void;
}
