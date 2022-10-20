import {
	ChangeEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react';
import { useGetAllSupplierNames } from '../../../../../../suppliers/suppliers.api';
import { useSearchParams } from 'react-router-dom';
import { parseSearchParams } from '../../../../../../products/components/ProductsTable/hooks/useProductsTable./useProductsTable';
import { useDebounce } from 'react-use';

export const useSelectSupplier = () => {
	const { supplierNames } = useGetAllSupplierNames();
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		filter,
		search,
		sort_by,
		sort_dir,
		cursor,
		limit,
		selected,
	} = parseSearchParams(searchParams);
	const [supplier, setSupplier] = useState(
		filter || supplierNames?.[0],
	);
	const onUpdateSupplier: ChangeEventHandler<HTMLSelectElement> =
		useCallback(
			(e) => {
				if (!e.target.value) return;

				searchParams.set('selected', '');

				setSupplier(e.target.value);
				setSearchParams(searchParams);
			},
			[setSupplier, setSearchParams],
		);
	const [, debouncedOnSearchParamsChange] = useDebounce(
		() => {
			searchParams.set('filter_by', 'supplier');
			searchParams.set('filter', supplier);

			setSearchParams(searchParams);
		},
		240,
		// Without all of these all search params but filter_by and filter work.
		[
			search,
			sort_by,
			sort_dir,
			cursor,
			limit,
			supplier,
			selected,
		],
	);

	useEffect(() => {
		debouncedOnSearchParamsChange();
	}, [debouncedOnSearchParamsChange]);

	return {
		supplierNames,
		supplier,
		onUpdateSupplier,
	};
};
