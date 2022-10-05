import { z } from 'zod';
import { relatedUserSchema } from './user';
import { ICompleteAccount } from '../interfaces';

export const accountSchema = z.object({
	id: z.string(),
	userId: z.string(),
	type: z.string(),
	provider: z.string(),
	providerAccountId: z.string(),
	refresh_token: z.string().nullish(),
	access_token: z.string().nullish(),
	expires_at: z.number().int().nullish(),
	token_type: z.string().nullish(),
	scope: z.string().nullish(),
	id_token: z.string().nullish(),
	session_state: z.string().nullish(),
	ext_expires_in: z.number().int(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * relatedAccountSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedAccountSchema: z.ZodSchema<ICompleteAccount> =
	z.lazy(() =>
		accountSchema.extend({
			user: relatedUserSchema,
		}),
	);
