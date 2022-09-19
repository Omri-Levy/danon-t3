import { google } from 'googleapis';

export const getOauthToken = async () => {
	const OAuth2 = google.auth.OAuth2;
	const oauth2Client = new OAuth2(
		process.env.CLIENT_ID,
		process.env.CLIENT_SECRET,
		'https://developers.google.com/oauthplayground',
	);

	oauth2Client.setCredentials({
		refresh_token: process.env.REFRESH_TOKEN,
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
