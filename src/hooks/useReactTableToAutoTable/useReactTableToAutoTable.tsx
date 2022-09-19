import { locale } from '../../translations';
import { useMemo } from 'react';
import { isBlacklisted } from '../../utils/is-blacklisted/is-blacklisted';
import { getHeaders } from '../../utils/get-headers/get-headers';

export const useReactTableToAutoTable = (
	table,
	blacklist,
): Array<{
	header: string;
	dataKey: string;
}> => {
	const columns = getHeaders(table)
		.filter((h) => !isBlacklisted(h.column.id, blacklist))
		.map((h) => ({
			header: locale.en[h.column.id],
			dataKey: h.column.id,
		}));

	return useMemo(() => columns, [blacklist]);
};
