import { useSearchParams } from 'react-router-dom';
import { ChangeEventHandler, useCallback, useState } from 'react';
import { useGetAllSupplierNames } from '../../../../../../suppliers/suppliers.api';

export const useSelectSupplier = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const prevSearchParams = Object.fromEntries(
		searchParams.entries(),
	);
	const [supplier, setSupplier] = useState(
		prevSearchParams?.filter ?? '',
	);
	const onUpdateSupplier: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(e) => {
				if (!e.target.value) return;

				setSupplier(e.target.value);
				setSearchParams({
					...prevSearchParams,
					filter_by: 'supplier',
					filter: e.target.value,
				});
			},
			[setSupplier, setSearchParams],
		);

	const { supplierNames } = useGetAllSupplierNames();

	return {
		supplierNames,
		supplier,
		onUpdateSupplier,
	};
};
