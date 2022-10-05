import { Dispatch, SetStateAction } from 'react';

export interface IOrdersActionsProps {
	rowSelection: Record<PropertyKey, boolean>;
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>;
}
