<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageServerData } from './$types';

	let { form, data }: { form: ActionData, data: PageServerData } = $props();

	let accountName = $state(data.accounts[0].name);

	let selectedAccount = $derived(data.accounts.find(x => x.name === accountName));
</script>

<h1>{ data.user.username } Withdrawals</h1>

<form method="POST" action="?/withdraw" use:enhance>
	<div>
		<label>
			Account:
			<select name="account" bind:value={accountName}>
				{#each data.accounts as account }
					<option value={account.name}>{account.name}</option>
				{/each}
			</select>
		</label>
		<span>Amount: ${selectedAccount?.amount}</span>
	</div>
	<div>
		<label>
			Amount:
			<input name="amount" />
		</label>
	</div>
	<button type="submit">Withdraw</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
