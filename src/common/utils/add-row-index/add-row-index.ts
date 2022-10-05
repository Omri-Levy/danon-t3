export const addRowIndex = <TItem>(item: TItem, index: number) => ({
	...item,
	rowIndex: index + 1,
});
