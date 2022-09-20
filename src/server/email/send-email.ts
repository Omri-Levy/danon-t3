import { createTransport } from 'nodemailer';
import { getOauthToken } from './get-oauth-token';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from 'src/env/server.mjs';

export const sendEmail = async (
	data: Mail.Options,
): Promise<SMTPTransport.SentMessageInfo> => {
	const accessToken = await getOauthToken();
	const transporter = createTransport({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: env.EMAIL,
			accessToken,
			clientId: env.CLIENT_ID,
			clientSecret: env.CLIENT_SECRET,
			refreshToken: env.REFRESH_TOKEN,
		},
	});

	return new Promise((resolve, reject) =>
		transporter.sendMail(data, (err, info) => {
			if (err) reject(err);

			resolve(info);
		}),
	);
};
