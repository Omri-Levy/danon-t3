// @ts-check
import {z} from 'zod';

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
	// Auth
	NEXTAUTH_SECRET: z.string(),
	NEXTAUTH_URL: z.string().url(),
	AZURE_AD_CLIENT_ID: z.string(),
	AZURE_AD_CLIENT_SECRET: z.string(),
	AZURE_AD_TENANT_ID: z.string(),
	// Used by Nodemailer as well.
	EMAIL: z.string().email(),
	PASS: z.string(),

	// App
	NODE_ENV: z.enum([`development`, `test`, `production`, `ci`]),
	DATABASE_URL: z.string().url(),
	S3_BUCKET: z.string(),
	S3_REGION: z.string(),
	S3_ACCESS_KEY: z.string(),
	S3_SECRET_KEY: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
	// NEXT_PUBLIC_BAR: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
	// NEXT_PUBLIC_BAR: process.env.NEXT_PUBLIC_BAR,
};
