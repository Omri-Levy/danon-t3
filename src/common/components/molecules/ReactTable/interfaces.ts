import {
	Cell,
	Header,
	HeaderGroup,
	Row,
	Table,
} from '@tanstack/table-core';
import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';

export interface IReactTableOptions<TItem> {
	filter?: (row: Row<TItem>) => boolean;
	tfoot?: ReactNode;
	renderHeader: (
		header: Header<TItem, unknown>,
		render: JSX.Element | ReactNode,
		index: number,
		isLastItem: boolean,
	) => JSX.Element;
	renderCell: (
		cell: Cell<TItem, unknown>,
		render: JSX.Element | ReactNode,
		index: number,
		isLastItem: boolean,
	) => JSX.Element;
	HeadRow: (
		props: {
			headerGroup: HeaderGroup<TItem>;
		} & DetailedHTMLProps<
			HTMLAttributes<HTMLTableRowElement>,
			HTMLTableRowElement
		>,
	) => JSX.Element;
	BodyRow: (
		props: { row: Row<TItem> } & DetailedHTMLProps<
			HTMLAttributes<HTMLTableRowElement>,
			HTMLTableRowElement
		>,
	) => JSX.Element;
	table: Table<TItem>;
}
