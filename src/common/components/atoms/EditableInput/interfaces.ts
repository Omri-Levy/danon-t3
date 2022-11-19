import { HTMLProps } from 'react';

export interface IEditableInputProps
	extends HTMLProps<HTMLInputElement> {
	isEditable?: boolean;
	initialValue: string;
	isCurrency?: boolean;
	onEdit?: (value: string) => void;
}
