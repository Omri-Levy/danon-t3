import { Unit } from '../../../common/enums';

export interface ICreateProductFormFields {
	supplier: string;
	sku: string;
	name: string;
	packageSize: number;
	unit: Unit;
	orderAmount: number;
	stock: number;
}
