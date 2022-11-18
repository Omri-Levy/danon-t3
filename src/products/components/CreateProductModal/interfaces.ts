import { Unit } from '../../../common/enums';

export interface ICreateProductFormFields {
	supplier: string;
	sku: string;
	name: string;
	packageSize: number;
	unit: keyof typeof Unit;
	orderAmount: number;
	pricePerUnit: number;
	stock: number;
}
