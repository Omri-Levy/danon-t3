import { FieldPath, FieldValues } from 'react-hook-form';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface FormSelectProps<
	TFields extends FieldPath<FieldValues>,
> extends DetailedHTMLProps<
		InputHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	> {
	name: TFields;
	label: string;
	options: Array<any>;
}
