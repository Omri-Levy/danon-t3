// Session
import { z } from 'zod';
import { relatedUserSchema } from './user';
import { ICompleteSession } from '../interfaces';

export const sessionSchema = z.object({
	id: z.string(),
	sessionToken: z.string(),
	userId: z.string(),
	expires: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

/**
 * relatedSessionSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedSessionSchema: z.ZodSchema<ICompleteSession> =
	z.lazy(() =>
		sessionSchema.extend({
			user: relatedUserSchema,
		}),
	);
