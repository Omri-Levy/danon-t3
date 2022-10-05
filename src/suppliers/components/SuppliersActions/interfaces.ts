import { Dispatch, SetStateAction } from 'react';

export interface ISuppliersActionsProps {
	rowSelection: Record<PropertyKey, boolean>;
	setRowSelection: Dispatch<
		SetStateAction<Record<PropertyKey, boolean>>
	>;
}
