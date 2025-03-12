import { and, eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { encodeBase64url } from '@oslojs/encoding';

export function generateAccountId() {
	const bytes = crypto.getRandomValues(new Uint8Array(15));
	return encodeBase64url(bytes);
}

export function generateTransactionId() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	return encodeBase64url(bytes);
}

export async function getAllAccounts(userId: string) {
	const result = await db.select({
		account: table.account
	})
		.from(table.account)
		.where(eq(table.account.userId, userId));

	return result.map(a => a.account).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
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

async function getAccount(userId: string, account: string) {
	const result = await db
		.select({
			account: table.account
		})
		.from(table.account)
		.where(and(eq(table.account.userId, userId), eq(table.account.name, account)));
	if (result.length == 0) {
		return null;
	}
	return result[0].account;
}

async function setAccountValue(userId: string, account: string, amount: number) {
	const c = await db.update(table.account)
		.set({ amount })
		.where(and(eq(table.account.userId, userId), eq(table.account.name, account)));
	return c.length > 0;
}

export async function deposit(userId: string, userAgent: string | null, accountName: string, amount: number): Promise<{ success: boolean, message: string | null }> {
	if (isNaN(amount)) {
		return { success: false, message: `${amount} is not a valid amount` };
	}

	if (amount <= 0) {
		return { success: false, message: `${amount} is not greater than 0` };
	}

	const account = await getAccount(userId, accountName);
	if (!account) {
		return { success: false, message: `Account ${accountName} not found` };
	}

	const deposit: table.Deposit = {
		id: generateTransactionId(),
		date: new Date(),
		initiatorUserAgent: userAgent,
		accountId: account.id,
		initialAccountAmount: account.amount,
		depositAmount: amount
	};

	await db.insert(table.deposit).values(deposit);

	await setAccountValue(userId, accountName, account.amount + amount);
	return { success: true, message: null };
}

export async function withdraw(userId: string, userAgent: string | null, accountName: string, amount: number): Promise<{ success: boolean, message: string | null }> {
	if (isNaN(amount)) {
		return { success: false, message: `${amount} is not a valid amount` };
	}

	if (amount <= 0) {
		return { success: false, message: `${amount} is not greater than 0` };
	}

	const account = await getAccount(userId, accountName);
	if (!account) {
		return { success: false, message: `Account ${accountName} not found` };
	}

	if (account.amount < amount) {
		return { success: false, message: `Account ${accountName} only has $${account.amount}` };
	}

	const withdraw: table.Withdraw = {
		id: generateTransactionId(),
		date: new Date(),
		initiatorUserAgent: userAgent,
		accountId: account.id,
		initialAccountAmount: account.amount,
		withdrawAmount: amount
	};

	await db.insert(table.withdraw).values(withdraw);

	await setAccountValue(userId, accountName, account.amount - amount);
	return { success: true, message: null };
}
