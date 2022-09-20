import * as z from 'zod';

export const VerificationTokenModel = z.object({
	identifier: z.string(),
	token: z.string(),
	expires: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
