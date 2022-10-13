import { useSearchParams as useReactRouterSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export const useSearchParams = <
	TSearchParams extends Record<PropertyKey, any>,
>() => {
	const [_searchParams, _setSearchParams] =
		useReactRouterSearchParams();
	const searchParams = Object.fromEntries(_searchParams.entries());
	const setSearchParams = useCallback(
		(state: Record<PropertyKey, any>, merge = true) => {
			const nextState = merge
				? {
						...searchParams,
						...state,
				  }
				: state;

			_setSearchParams(nextState);
		},
		[_setSearchParams, searchParams],
	);
	const searchParamsAsString = _searchParams.toString();

	return [
		searchParams as TSearchParams,
		setSearchParams,
		searchParamsAsString,
	] as const;
};
