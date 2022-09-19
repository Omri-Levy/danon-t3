import { createTransport } from 'nodemailer';
import { t } from '../utils';
import {
	idSchema,
	idsSchema,
	OrderModel,
	SupplierModel,
} from '../../../../prisma/zod';
import { google } from 'googleapis';
import { z } from 'zod';
import { getLocaleDateString } from '../../../get-locale-date-string';

export const ordersRouter = t.router({
	getOrders: t.procedure.query(() => {
		return prisma?.order.findMany();
	}),
	getOrderById: t.procedure.input(idSchema).query(({ input }) => {
		return prisma?.order.findUnique({
			where: { id: input.id },
		});
	}),
	createOrder: t.procedure
		.input(OrderModel)
		.mutation(({ input }) => {
			return prisma?.order.create({ data: input });
		}),
	updateOrder: t.procedure
		.input(OrderModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			return prisma?.order.update({
				where: { id: input.id },
				data: input,
			});
		}),
	deleteSelectedOrders: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return prisma?.order.deleteMany({
				where: { id: { in: input.ids } },
			});
		}),
	sendOrder: t.procedure
		.input(
			z
				.object({
					pdf: z.union([
						z.string(),
						z.instanceof(ArrayBuffer),
						z.null(),
					]),
				})
				.merge(
					SupplierModel.pick({
						name: true,
					}),
				),
		)
		.mutation(async ({ input }) => {
			const { name, pdf } = input;
			const supplier = await prisma?.supplier.findFirst({
				where: { name },
			});

			const OAuth2 = google.auth.OAuth2;
			const oauth2Client = new OAuth2(
				process.env.CLIENT_ID,
				process.env.CLIENT_SECRET,
				'https://developers.google.com/oauthplayground',
			);

			oauth2Client.setCredentials({
				refresh_token: process.env.REFRESH_TOKEN,
			});
			const accessToken = await new Promise(
				(resolve, reject) => {
					oauth2Client.getAccessToken((err, token) => {
						if (err) {
							reject(err);
						}
						resolve(token);
					});
				},
			);
			const transporter = createTransport({
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
			const mailData = {
				from: process.env.EMAIL,
				to: supplier?.email,
				subject: `Hello ${
					supplier?.name
				}, please accept this order. #${'orderNumber'}`,
				text: `Order PDF attached.`,
				attachments: [
					{
						filename: `order-${getLocaleDateString()}-#${'orderNumber'}.pdf`,
						path: pdf,
						contentType: 'application/pdf',
						encoding: 'base64',
					},
				],
			};
			transporter.sendMail(mailData, function (err, info) {
				if (err) {
					console.log(err);

					return;
				}

				console.log(info);
			});

			await prisma?.product.updateMany({
				data: {
					orderAmount: 0,
				},
			});

			return;
		}),
});
