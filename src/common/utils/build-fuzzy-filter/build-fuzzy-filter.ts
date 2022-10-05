import { rankItem } from '@tanstack/match-sorter-utils';
import { TBuildFuzzyFilter } from './types';

export const buildFuzzyFilter: TBuildFuzzyFilter =
	() => (row, columnId, value, addMeta) => {
		// Rank the item
		const itemRank = rankItem(row.getValue(columnId), value);

		// Store the itemRank info
		addMeta({
			itemRank,
		});

		// Return if the item should be filtered in/out
		return itemRank.passed;
	};
