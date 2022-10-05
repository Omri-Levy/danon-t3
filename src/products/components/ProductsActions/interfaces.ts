import { Dispatch, SetStateAction } from 'react';

export interface IProductsActionsProps {
	rowSelection: Record<PropertyKey, boolean>;
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>;
}
