import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import * as accounts from '$lib/server/accounts.js'

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	let accountsRet: accounts.AllAccountsResult | null;
	if (user) {
		accountsRet = await accounts.getAllAccounts(user.id);
	} else {
		accountsRet = null;
	}

	event.locals.user = user;
	event.locals.session = session;
	event.locals.accounts = accountsRet;

	return resolve(event);
};

export const handle: Handle = handleAuth;
