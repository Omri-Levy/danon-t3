import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useGetAllSupplierNames } from '../../../../../../suppliers/suppliers.api';
import { useSearchParams } from '../../../../../hooks/useSearchParams/useSearchParams';

export const useSelectSupplier = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { supplierNames } = useGetAllSupplierNames();
	const [supplier, setSupplier] = useState(
		searchParams?.filter || supplierNames?.[0],
	);
	const onUpdateSupplier: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(e) => {
				if (!e.target.value) return;

				setSupplier(e.target.value);
			},
			[setSupplier],
		);

	useEffect(() => {
		setSearchParams({
			filter_by: 'supplier',
			filter: supplier,
		});
	}, [supplier]);

	return {
		supplierNames,
		supplier,
		onUpdateSupplier,
	};
};
