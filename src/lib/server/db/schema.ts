import {pgTable, serial, text, integer, timestamp, real} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
	userAgent: text('user_agent')
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	amount: real('amount')
		.notNull()
		.default(0)
})

export const deposit = pgTable('deposit', {
	id: text('id').primaryKey(),
	date: timestamp('date').notNull(),
	initiatorUserAgent: text("user_agent"),
	accountId: text('account_id')
		.notNull()
		.references(() => account.id),
	initialAccountAmount: real('initial_account_amount').notNull().default(0),
	depositAmount: real('deposit_amount').notNull().default(0)
})

export const withdraw = pgTable('withdraw', {
	id: text('id').primaryKey(),
	date: timestamp('date').notNull(),
	initiatorUserAgent: text("user_agent"),
	accountId: text('account_id')
		.notNull()
		.references(() => account.id),
	initialAccountAmount: real('initial_account_amount').notNull().default(0),
	withdrawAmount: real('withdraw_amount').notNull().default(0)
})

export const transfer = pgTable('transfer', {
	id: text('id').primaryKey(),
	date: timestamp('date').notNull(),
	initiatorUserAgent: text("user_agent"),
	fromAccountId: text('from_account_id')
		.notNull()
		.references(() => account.id),
	toAccountId: text('to_account_id')
		.notNull()
		.references(() => account.id),
	transferAmount: real('transfer_amount').notNull().default(0),
	fromInitialAccountAmount: real('from_initial_account_amount').notNull().default(0),
	toInitialAccountAmount: real('to_initial_account_amount').notNull().default(0),
})

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;

export type Account = typeof account.$inferSelect;

export type Deposit = typeof deposit.$inferSelect;
export type Withdraw = typeof withdraw.$inferSelect;
export type Transfer = typeof transfer.$inferSelect;
