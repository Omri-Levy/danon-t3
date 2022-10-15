import {
	MutationCache,
	QueryCache,
	QueryClient,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { locale } from '../../translations';
import { isErrorWithMessage } from '../is-error-with-message/is-error-with-message';
import { isObject } from '../is-object/is-object';
import { IGlobalToastContext } from './interfaces';
import { isResetOrderAmountOrSend } from './utils/is-reset-order-amount-or-send/is-reset-order-amount-or-send';

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			if (!isErrorWithMessage(error)) return;

			toast.error(error.message);
		},
	}),
	mutationCache: new MutationCache({
		onSuccess: (data, variables, context) => {
			if (!isObject<IGlobalToastContext>(context)) return;

			const message =
				context?.resource && context?.action
					? `${locale.he.actions.success} ${
							locale.he.actions[context.resource][
								context.action
							]
					  }`
					: locale.he.actions.success.replace(':', '');

			toast.success(message);
		},
		onError: (error, variables, context) => {
			if (
				!isObject<IGlobalToastContext>(context) ||
				!isErrorWithMessage(error)
			)
				return;

			const message =
				context?.resource && context?.action
					? `${locale.he.actions.error} ${
							isResetOrderAmountOrSend(context.action)
								? locale.he.actions[context.resource][
										context.action
								  ]
								: error.message
					  }`
					: locale.he.actions.error.replace(':', '');

			toast.error(message);
		},
	}),
});
