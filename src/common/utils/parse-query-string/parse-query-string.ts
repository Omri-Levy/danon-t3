import queryString from 'query-string';
import produce from 'immer';

export const parseQueryString = <
	TRecord extends Record<PropertyKey, any>,
>(
	query: string,
) => {
	const object = queryString.parse(query) as Record<
		PropertyKey,
		string
	>;

	if (!object) return;

	return produce(object, (draft) => {
		Object.keys(draft).forEach((key) => {
			draft[key] = JSON.parse(draft[key] ?? '');
		});
	}) as TRecord;
};
