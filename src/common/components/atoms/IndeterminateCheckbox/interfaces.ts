import { HTMLProps } from 'react';

export interface IIndeterminateCheckboxProps
	extends HTMLProps<HTMLInputElement> {
	indeterminate?: boolean;
}
