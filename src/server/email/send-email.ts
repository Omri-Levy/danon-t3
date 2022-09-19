import { createTransport } from 'nodemailer';
import { getOauthToken } from './get-oauth-token';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const sendEmail = async (data: Mail.Options) => {
	const accessToken = await getOauthToken();
	const transporter = createTransport({
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: process.env.EMAIL,
			accessToken,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
		},
	});
	let result: SMTPTransport.SentMessageInfo | undefined;

	transporter.sendMail(data, (err, info) => {
		if (err) throw err;

		result = info;
	});

	return result;
};
