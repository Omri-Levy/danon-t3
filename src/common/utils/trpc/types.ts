import { locale } from '../../translations';

export type Resource = keyof Omit<
	typeof locale.he.actions,
	'success' | 'error'
>;

export type Action = keyof typeof locale.he.actions[Resource];
