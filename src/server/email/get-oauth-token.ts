import { google } from 'googleapis';
import { env } from 'src/env/server.mjs';

export const getOauthToken = async () => {
	const OAuth2 = google.auth.OAuth2;
	const oauth2Client = new OAuth2(
		env.CLIENT_ID,
		env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground',
	);

	oauth2Client.setCredentials({
		refresh_token: env.REFRESH_TOKEN,
	});

	return new Promise((resolve, reject) => {
		oauth2Client.getAccessToken((err, token) => {
			if (err) {
				reject(err);
			}
			resolve(token);
		});
	});
};
