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
	create: async (event) => {
		if (!event.locals.user) {
			return fail(401);
		}

		const formData = await event.request.formData();
		const name = formData.get('name');

		if (!validateAccountName(name)) {
			return fail(400, { message: 'Invalid account name' });
		}

		await accounts.addAccount(event.locals.user.id, name);
	}
}

function validateAccountName(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}
