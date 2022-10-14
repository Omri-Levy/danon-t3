import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchParamState = (
	key: string,
	initialValue: string,
) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const value = searchParams.get(key) ?? initialValue;
	const setValue = useCallback(
		(value: string) => {
			searchParams.set(key, value);

			setSearchParams(searchParams);
		},
		[setSearchParams, key, initialValue],
	);

	useEffect(() => {
		if (searchParams.has(key)) return;

		setSearchParams(initialValue);
	}, []);

	return [value, setValue] as const;
};
