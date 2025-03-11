<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>{data.user.username} Accounts</h1>

<table>
	<thead>
	<tr>
		<th>Account Name</th>
		<th>Account Amount</th>
	</tr>
	</thead>
	<tbody>
	{#if data.accounts.length < 1}
		<tr>
			<td>No Accounts</td>
		</tr>
	{/if}
	{#each data.accounts as account}
		<tr>
			<td>{account.name}</td>
			<td>${account.amount}</td>
		</tr>
	{/each}
	</tbody>
</table>

<div>
	<h2>Create Account</h2>
	<form method="POST" action="?/create" use:enhance>
		<label>
			Account Name:
			<input name="name" />
		</label>
		<button>Create</button>
	</form>
</div>
