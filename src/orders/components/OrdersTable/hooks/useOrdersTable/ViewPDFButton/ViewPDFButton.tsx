import { CellContext, RowData } from '@tanstack/table-core';
import { PropsWithChildren, useCallback } from 'react';
import { TOrderGetAllOutput } from '../../../../../../common/types';
import { locale } from '../../../../../../common/translations';

export const ViewPDFButton = <TRowData extends RowData, TValue>({
	orders,
	row: { index },
	onIdChange,
	onOpen,
}: PropsWithChildren<{
	orders: TOrderGetAllOutput;
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
		<button
			className={`btn btn-ghost`}
			onClick={handleIdChange}
			type={`button`}
		>
			{locale.he.view}
		</button>
	);
};
