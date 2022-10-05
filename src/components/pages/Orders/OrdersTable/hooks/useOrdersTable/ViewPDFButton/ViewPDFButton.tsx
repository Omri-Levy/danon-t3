import { CellContext, RowData } from '@tanstack/table-core';
import { PropsWithChildren, useCallback } from 'react';
import { OrderGetAllOutput } from '../../../../../../../types';
import { locale } from '../../../../../../../translations';

export const ViewPDFButton = <TRowData extends RowData, TValue>({
	orders,
	row: { index },
	onIdChange,
	onOpen,
}: PropsWithChildren<{
	orders: OrderGetAllOutput;
	onIdChange: (id: string) => void;
	onOpen: () => void;
}> &
	CellContext<TRowData, TValue>) => {
	const id = orders?.[index]?.id ?? '';
	const handleIdChange = useCallback(() => {
		onIdChange(id);
		onOpen();
	}, [onIdChange, onOpen, id]);

	return (
		<button className={`btn btn-ghost`} onClick={handleIdChange}>
			{locale.he.view}
		</button>
	);
};
