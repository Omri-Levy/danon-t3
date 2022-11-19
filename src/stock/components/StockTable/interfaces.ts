import { Table } from '@tanstack/table-core';
import { TProductGetByIdOutput } from '../../../common/types';

export interface IProductsTableProps {
	table: Table<TProductGetByIdOutput>;
}
