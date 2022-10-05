import { Table } from '@tanstack/table-core';
import { TOrderGetByIdOutput } from '../../../common/types';

export interface IOrdersTableProps {
	table: Table<TOrderGetByIdOutput>;
}
