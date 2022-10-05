import { DetailedHTMLProps, TableHTMLAttributes } from 'react';
import { IReactTableOptions } from './interfaces';

export type TReactTableProps<TItem> = IReactTableOptions<TItem> &
	DetailedHTMLProps<
		TableHTMLAttributes<HTMLTableElement>,
		HTMLTableElement
	>;
