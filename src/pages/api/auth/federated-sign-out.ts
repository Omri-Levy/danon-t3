import {env} from '../../../common/env/server.mjs';
import {NextApiHandler} from 'next';

const federatedSignOut: NextApiHandler = async (req, res) => {
	return res.redirect(
		`https://login.microsoftonline.com/${
			env.AZURE_AD_TENANT_ID
		}/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(
			`${env.NEXTAUTH_URL}/auth/sign-out`,
		)}`,
	);
};

export default federatedSignOut;
