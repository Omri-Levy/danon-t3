import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '../common/env/server.mjs';

export const sendEmail = async (
	data: Mail.Options,
): Promise<SMTPTransport.SentMessageInfo> => {
	const transporter = createTransport({
		host: 'smtp.outlook.com',
		port: 587,
		secure: false,
		auth: {
			user: env.EMAIL,
			pass: env.PASS,
		},
	});

	return new Promise((resolve, reject) =>
		transporter.sendMail(data, (err, info) => {
			if (err) reject(err);

			resolve(info);
		}),
	);
};
