export const getHeaders = (table) =>
	table
		.getHeaderGroups()
		.flatMap((headerGroup) => headerGroup.headers);
