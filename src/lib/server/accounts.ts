import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { encodeBase64url } from '@oslojs/encoding';

export function generateAccountId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase64url(bytes);
}

export async function getAllAccounts(userId: string) {
	const result = await db.select({
		account: table.account
	})
		.from(table.account)
		.innerJoin(table.user, eq(table.user.id, userId));

	return result.map(a => a.account);
}

export type AllAccountsResult = Awaited<ReturnType<typeof getAllAccounts>>;

export async function addAccount(userId: string, name: string) {
	const account: table.Account = {
		id: generateAccountId(),
		name: name,
		userId,
		amount: 0
	}
	await db.insert(table.account).values(account);
	return account;
}
