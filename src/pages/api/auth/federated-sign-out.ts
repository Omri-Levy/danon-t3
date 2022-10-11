import { env } from '../../../common/env/server.mjs';
import { NextApiHandler } from 'next';
import { getBaseUrl } from '../../../common/utils/trpc/get-base-url';

const federatedSignOut: NextApiHandler = async (req, res) => {
	return res.redirect(
		`https://login.microsoftonline.com/${
			env.AZURE_AD_TENANT_ID
		}/oauth2/logout?post_logout_redirect_uri=${encodeURIComponent(
			`${getBaseUrl()}/auth/sign-out`,
		)}`,
	);
};

export default federatedSignOut;
