import AWS from 'aws-sdk';
import { env } from '../../env/server.mjs';

export const s3Client = new AWS.S3({
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY,
	},
	region: env.S3_REGION,
});
