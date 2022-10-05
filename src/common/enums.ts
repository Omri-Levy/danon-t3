export const Unit = {
	KG: 'KG',
	G: 'G',
	L: 'L',
	ML: 'ML',
	UN: 'UN',
	CC: 'CC',
} as const;
export const Units = Object.values(Unit);
Object.freeze(Unit);
Object.freeze(Units);
