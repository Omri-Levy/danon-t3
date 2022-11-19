import { Unit } from './enums';

export const locale = {
	he: {
		importProducts: `ייבוא מוצרים`,
		exportProducts: `יצוא מוצרים`,
		areYouSureYouWantToDeleteSelectedItems: (items: string) =>
			`האם את/ה בטוח/ה שברצונך למחוק את ה${items} הנבחרים?`,
		confirm: 'אישור',
		row: 'שורה',
		view: `צפייה`,
		pdf: `מסמך`,
		orderNumber: `מספר הזמנה`,
		createdAt: `נוצר בתאריך`,
		orders: `הזמנות`,
		noSuppliers: `לא ניתן ליצור מוצרים ללא ספקים. נא צרו לפחות ספק אחד ונסו שנית.`,
		navigateToSuppliers: `ניווט לספקים`,
		attention: `שימו לב`,
		mailSender: `דנון הזמנת כימיקלים`,
		mailGreeting: (supplier: string, order: string) =>
			`${supplier} שלום, נא קבלו הזמנתנו מספר ${order}`,
		orderPdf: `מסמך הזמנה הוצמד`,
		validation: {
			supplier: {
				notFound: (plural = false) =>
					plural ? `לא נמצאו ספקים` : `ספק לא נמצא`,
				emailAlreadyExists: (email: string) =>
					`ספק עם האימייל ${email} כבר קיים`,
				nameAlreadyExists: (name: string) =>
					`ספק עם השם ${name} כבר קיים`,
				email: {
					max: `אימייל חייב לכלול עד 320 תו(וים)`,
					invalid: `אימייל חייב להיות כתובת אימייל תקינה`,
				},
				name: {
					min: `שם ספק חייב לכלול לפחות 1 תו(וים)`,
					max: `שם ספק חייב לכלול עד 120 תו(וים)`,
					enum: (supplierNames: Array<string>) =>
						supplierNames?.length > 5
							? `שם ספק חייב להיות אחד מהשמות הקיימים`
							: `שם ספק חייב להיות אחד מהבאים: ${supplierNames.join(
									`, `,
							  )}`,
				},
			},
			product: {
				alreadyExists: (sku: string) =>
					`מוצר עם המק"ט ${sku} כבר קיים`,
				sku: {
					min: `מק"ט חייב לכלול לפחות 1 תו(וים)`,
					max: `מק"ט חייב לכלול עד 10 תו(וים)`,
				},
				name: {
					min: `שם מוצר חייב לכלול לפחות 1 תו(וים)`,
					max: `שם מוצר חייב לכלול עד 120 תו(וים)`,
				},
				unit: {
					invalid: `יחידת מידה חייבת להיות אחת מן הערכים הבאים: ${Object.values(
						Unit,
					).join(`, `)}`,
				},
				packageSize: {
					invalid: `גודל אריזה חייב להיות מספר חיובי`,
					max: `גודל אריזה חייב להיות קטן יותר או שווה ל1000`,
					min: `גודל אריזה חייב להיות גדול יותר מ0`,
				},
				orderAmount: {
					invalid: `כמות להזמנה חייבת להיות מספר חיובי`,
					max: `כמות להזמנה חייבת להיות קטנה יותר או שווה ל1000`,
					min: `כמות להזמנה חייבת להיות גדולה יותר מ0`,
				},
				pricePerUnit: {
					invalid: `מחיר ליחידה חייב להיות מספר חיובי`,
					max: `מחיר ליחידה חייב להיות קטן יותר או שווה ל1000`,
					min: `מחיר ליחידה חייב להיות גדול יותר מ0`,
				},
				stock: {
					invalid: `מלאי חייב להיות מספר חיובי`,
					max: `מלאי חייב להיות קטן יותר או שווה ל1000`,
					min: `מלאי חייב להיות גדול יותר מ0`,
				},
			},
			order: {
				notFound: (plural = false) =>
					plural ? `לא נמצאו הזמנות` : `הזמנה לא נמצאה`,
			},
		},
		signIn: `התחברות`,
		signInWithOutlook: `התחברות עם Outlook`,
		signOut: `התנתקות`,
		to: `ל`,
		sku: `מק"ט`,
		productName: `שם מוצר`,
		unit: `יחידה`,
		packageSize: `גודל אריזה`,
		pricePerUnit: `מחיר ליחידה`,
		cost: `עלות`,
		orderAmount: `כמות הזמנה`,
		stock: `מלאי`,
		name: `שם`,
		email: `אימייל`,
		create: `יצירה`,
		print: `הדפסה`,
		send: `שליחה`,
		order: `הזמנה`,
		delete: `מחיקה`,
		reload: `רענון`,
		resetOrderAmount: `איפוס כמות הזמנה`,
		search: `חיפוש ב$1 $2...`,
		mustBeDivisibleBy: `כמות הזמנה חייבת להתחלק בגודל אריזה`,
		createProduct: `יצירת מוצר`,
		createSupplier: `יצירת ספק`,
		supplier: `ספק`,
		suppliers: `ספקים`,
		products: `מוצרים`,
		actions: {
			success: `פעולה הצליחה:`,
			error: `פעולה נכשלה:`,
			product: {
				create: `יצירת מוצר`,
				update: `עדכון מוצר`,
				delete: `מחיקת מוצרים`,
				resetOrderAmount: `איפוס כמות הזמנה`,
				importCSV: `ייבוא מוצרים`,
			},
			supplier: {
				create: `יצירת ספק`,
				update: `עדכון ספק`,
				delete: `מחיקת ספקים`,
			},
			order: {
				create: `יצירת הזמנה`,
				update: `עדכון הזמנה`,
				delete: `מחיקת הזמנות`,
				send: `שליחת הזמנה`,
			},
		},
	},
	en: {
		importProducts: `Import products`,
		exportProducts: `Export products`,
		areYouSureYouWantToDeleteSelectedItems: (items: string) =>
			`Are you sure you want like to delete the following ${items}?`,
		confirm: `Confirm`,
		row: `Row`,
		view: `View`,
		pdf: `PDF`,
		orderNumber: `Order number`,
		createdAt: `Created At`,
		orders: `Orders`,
		noSuppliers: `It is not possible to create products with no suppliers. Please create at least one supplier and try again.`,
		navigateToSuppliers: `Navigate to suppliers`,
		attention: `Attention`,
		mailSender: `Danon chemicals ordering`,
		mailGreeting: (supplier: string, order: string) =>
			`Hello ${supplier}, please accept our order number ${order}`,
		orderPdf: `Order PDF attached.`,
		validation: {
			supplier: {
				notFound: (plural = false) =>
					plural
						? `Suppliers not found`
						: `Supplier not found`,
				emailAlreadyExists: (email: string) =>
					`Supplier with email ${email} already exists`,
				nameAlreadyExists: (name: string) =>
					`Supplier with name ${name} already exists`,
				email: {
					max: `Email must contain at most 320 character(s)`,
					invalid: `Email must be a valid email address`,
				},
				name: {
					min: `Supplier name must contain at least 1 character(s)`,
					max: `Supplier name must contain at most 120 character(s)`,
					enum: (supplierNames: Array<string>) =>
						supplierNames?.length > 5
							? `Supplier name must be one of the existing names`
							: `Supplier name must be one of the following: ${supplierNames.join(
									`, `,
							  )}`,
				},
			},
			product: {
				alreadyExists: (sku: string) =>
					`Product with SKU ${sku} already exists`,
				sku: {
					min: `SKU must contain at least 1 character(s)`,
					max: `SKU must contain at most 10 character(s)`,
				},
				name: {
					min: `Product name must contain at least 1 character(s)`,
					max: `Product name must contain at most 120 character(s)`,
				},
				packageSize: {
					invalid: `Package size must be a positive number`,
					max: `Package size must be less than or equal to 1000`,
				},
				orderAmount: {
					invalid: `Order amount must be a positive number`,
					max: `Order amount must be less than or equal to 1000`,
				},
				pricePerUnit: {
					invalid: `Price per unit must be a positive number`,
					max: `Price per unit must be less than or equal to 1000`,
				},
				stock: {
					invalid: `Stock must be a positive number`,
					max: `Stock must be less than or equal to 1000`,
				},
			},
			order: {
				notFound: (plural = false) =>
					plural ? `Orders not found` : `Order not found`,
			},
		},
		signIn: `Sign in`,
		signInWithOutlook: `Sign in with Outlook`,
		signOut: `Sign out`,
		to: `To`,
		sku: `Sku`,
		productName: `Product Name`,
		unit: `Unit`,
		packageSize: `Package Size`,
		pricePerUnit: `Price Per Unit`,
		cost: `Cost`,
		orderAmount: `Order Amount`,
		stock: `Stock`,
		name: `Name`,
		email: `Email`,
		create: `Create`,
		print: `Print`,
		send: `Send`,
		order: `Order`,
		delete: `Delete`,
		reload: `Reload`,
		reset: `Reset Order Amount`,
		search: `Search in $1 products...`,
		mustBeDivisibleBy: `Order Amount must be divisible by Package Size`,
		createProduct: `Create Product`,
		createSupplier: `Create Supplier`,
		supplier: `Supplier`,
		suppliers: `Suppliers`,
		products: `Products`,
		actions: {
			success: `Action succeeded:`,
			error: `Action failed:`,
			product: {
				create: `creating product`,
				update: `updating product`,
				delete: `deleting products`,
				resetOrderAmount: `reset order amount`,
				importCSV: `Import products`,
			},
			supplier: {
				create: `creating supplier`,
				update: `updating supplier`,
				delete: `deleting suppliers`,
			},
		},
	},
};
