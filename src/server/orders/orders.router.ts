import {
	idSchema,
	idsSchema,
	OrderModel,
	SupplierModel,
} from '../../../prisma/zod';
import { z } from 'zod';
import { t } from '../trpc/utils';
import { sendEmail } from '../email/send-email';
import { getLocaleDateString } from '../../utils/get-locale-date-string/get-locale-date-string';
import { ordersRepository } from './orders.repository';

export const ordersRouter = t.router({
	getAll: t.procedure.query(() => {
		return ordersRepository.getAll();
	}),
	getById: t.procedure.input(idSchema).query(({ input }) => {
		return ordersRepository.getById(input);
	}),
	create: t.procedure
		.input(
			OrderModel.omit({
				id: true,
				orderNumber: true,
				createdAt: true,
				updatedAt: true,
			}),
		)
		.mutation(({ input }) => {
			return ordersRepository.create(input);
		}),
	updateById: t.procedure
		.input(OrderModel.partial().merge(idSchema))
		.mutation(({ input }) => {
			return ordersRepository.updateById({
				id: input.id,
				data: input,
			});
		}),
	deleteByIds: t.procedure
		.input(idsSchema)
		.mutation(({ input }) => {
			return ordersRepository.deleteByIds(input);
		}),
	send: t.procedure
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

			const info = await sendEmail({
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
			});

			console.log(info);

			await prisma?.product.updateMany({
				data: {
					orderAmount: 0,
				},
			});

			return;
		}),
});
