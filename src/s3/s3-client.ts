import AWS from 'aws-sdk';
import { env } from '../common/env/server.mjs';

export const s3Client = new AWS.S3({
	signatureVersion: 'v4',
	credentials: {
		accessKeyId: env.S3_ACCESS_KEY,
		secretAccessKey: env.S3_SECRET_KEY,
	},
	region: env.S3_REGION,
});
