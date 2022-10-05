import { z } from 'zod';
import { accountSchema } from './validation/account';
import { sessionSchema } from './validation/session';
import { userSchema } from './validation/user';

export interface ICompleteUser extends z.infer<typeof userSchema> {
	accounts: ICompleteAccount[];
	sessions: ICompleteSession[];
}

export interface ICompleteAccount
	extends z.infer<typeof accountSchema> {
	user: ICompleteUser;
}

export interface ICompleteSession
	extends z.infer<typeof sessionSchema> {
	user: ICompleteUser;
}
