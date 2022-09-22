import { Unit } from '@prisma/client';

// Amza שלום, נא קבלו הזמנתו #0

export const locale = {
	he: {
		mailGreeting: (supplier: string, order: number) =>
			`${supplier} שלום, נא קבלו הזמנתנו. #${order}`,
		orderPdf: `מסמך הזמנה הוצמד`,
		validation: {
			supplier: {
				email: {
					max: 'אימייל חייב לכלול עד 320 תו(וים)',
					invalid: 'אימייל חייב להיות כתובת אימייל תקינה',
				},
				name: {
					min: 'שם ספק חייב לכלול לפחות 1 תו(וים)',
					max: 'שם ספק חייב לכלול עד 120 תו(וים)',
				},
			},
			product: {
				sku: {
					min: 'מק"ט חייב לכלול לפחות 1 תו(וים)',
					max: 'מק"ט חייב לכלול עד 10 תו(וים)',
				},
				name: {
					min: 'שם מוצר חייב לכלול לפחות 1 תו(וים)',
					max: 'שם מוצר חייב לכלול עד 120 תו(וים)',
				},
				unit: {
					invalid: `יחידת מידה חייבת להיות אחת מן הערכים הבאים: ${Object.values(
						Unit,
					).join(', ')}`,
				},
				packageSize: {
					invalid: `גודל חבילה חייב להיות מספר חיובי`,
					max: 'גודל חבילה חייב להיות קטן יותר או שווה ל1000',
				},
				orderAmount: {
					invalid: `כמות להזמנה חייבת להיות מספר חיובי`,
					max: 'כמות להזמנה חייבת להיות קטנה יותר או שווה ל1000',
				},
				stock: {
					invalid: `מלאי חייב להיות מספר חיובי`,
					max: 'מלאי חייב להיות קטן יותר או שווה ל1000',
				},
			},
		},
		signIn: 'התחברות',
		signInWithOutlook: 'התחברות עם Outlook',
		signOut: 'התנתקות',
		to: 'ל',
		sku: 'מק"ט',
		productName: 'שם מוצר',
		unit: 'יחידה',
		packageSize: 'גודל אריזה',
		orderAmount: 'כמות הזמנה',
		stock: 'מלאי',
		name: 'שם',
		email: 'אימייל',
		create: 'יצירה',
		print: 'הדפסה',
		send: 'שליחה',
		order: 'הזמנה',
		delete: 'מחיקה',
		reload: 'רענון',
		resetOrderAmount: 'איפוס כמות הזמנה',
		search: 'חיפוש ב$1 מוצרים...',
		mustBeDivisibleBy: 'כמות הזמנה חייבת להתחלק בגודל אריזה',
		createProduct: 'יצירת מוצר',
		createSupplier: 'יצירת ספק',
		supplier: 'ספק',
		suppliers: 'ספקים',
		products: 'מוצרים',
		actions: {
			success: `פעולה הצליחה:`,
			error: `פעולה נכשלה:`,
			product: {
				create: 'יצירת מוצר',
				update: 'עדכון מוצר',
				delete: 'מחיקת מוצרים',
				resetOrderAmount: 'איפוס כמות הזמנה',
			},
			supplier: {
				create: 'יצירת ספק',
				update: 'עדכון ספק',
				delete: 'מחיקת ספקים',
			},
			order: {
				create: 'יצירת הזמנה',
				update: 'עדכון הזמנה',
				delete: 'מחיקת הזמנות',
				send: 'שליחת הזמנה',
			},
		},
	},
	en: {
		mailGreeting: (supplier: string, order: number) =>
			`Hello ${supplier}, please accept our order. #${order}`,
		orderPdf: `Order PDF attached.`,
		validation: {
			supplier: {
				email: {
					max: 'Email must contain at most 320 character(s)',
					invalid: 'Email must be a valid email address',
				},
				name: {
					min: 'Supplier name must contain at least 1 character(s)',
					max: 'Supplier name must contain at most 120 character(s)',
				},
			},
			product: {
				sku: {
					min: 'SKU must contain at least 1 character(s)',
					max: 'SKU must contain at most 10 character(s)',
				},
				name: {
					min: 'Product name must contain at least 1 character(s)',
					max: 'Product name must contain at most 120 character(s)',
				},
				packageSize: {
					invalid: `Package size must be a positive number`,
					max: 'Package size must be less than or equal to 1000',
				},
				orderAmount: {
					invalid: `Order amount must be a positive number`,
					max: 'Order amount must be less than or equal to 1000',
				},
				stock: {
					invalid: `Stock must be a positive number`,
					max: 'Stock must be less than or equal to 1000',
				},
			},
		},
		signIn: 'Sign in',
		signInWithOutlook: 'Sign in with Outlook',
		signOut: 'Sign out',
		to: 'To',
		sku: 'Sku',
		productName: 'Product Name',
		unit: 'Unit',
		packageSize: 'Package Size',
		orderAmount: 'Order Amount',
		stock: 'Stock',
		name: 'Name',
		email: 'Email',
		create: 'Create',
		print: 'Print',
		send: 'Send',
		order: 'Order',
		delete: 'Delete',
		reload: 'Reload',
		reset: 'Reset Order Amount',
		search: 'Search in $1 products...',
		mustBeDivisibleBy:
			'Order Amount must be divisible by Package Size',
		createProduct: 'Create Product',
		createSupplier: 'Create Supplier',
		supplier: 'Supplier',
		suppliers: 'Suppliers',
		products: 'Products',
		actions: {
			success: `Action succeeded:`,
			error: `Action failed:`,
			product: {
				create: 'creating product',
				update: 'updating product',
				delete: 'deleting products',
				resetOrderAmount: 'reset order amount',
			},
			supplier: {
				create: 'creating supplier',
				update: 'updating supplier',
				delete: 'deleting suppliers',
			},
		},
	},
};
