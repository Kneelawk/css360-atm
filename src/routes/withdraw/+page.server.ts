import * as accounts from '$lib/server/accounts';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login');
	}
	return { user: event.locals.user, accounts: event.locals.accounts! };
};

export const actions: Actions = {
	withdraw: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}

		const formData = await event.request.formData();
		const accountName = String(formData.get('account'));
		const amount = Number(formData.get('amount'));

		if (isNaN(amount)) {
			return fail(401, { message: `${formData.get('amount')} is not a valid amount` });
		}

		const userAgent = event.request.headers.get('User-Agent');

		const res = await accounts.withdraw(event.locals.user.id, userAgent, accountName, amount);
		if (!res.success) {
			return fail(401, { message: res.message });
		}
	}
};
