export interface IDuplicateEntryError {
	code: 'ER_DUP_ENTRY';
	sqlMessage: string;
}
