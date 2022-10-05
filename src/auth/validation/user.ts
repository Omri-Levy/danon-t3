// User
import { z } from 'zod';
import { relatedSessionSchema } from './session';
import { relatedAccountSchema } from './account';
import { ICompleteUser } from '../interfaces';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().nullish(),
	emailVerified: z.date().nullish(),
	image: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<ICompleteUser> = z.lazy(
	() =>
		userSchema.extend({
			accounts: relatedAccountSchema.array(),
			sessions: relatedSessionSchema.array(),
		}),
);
