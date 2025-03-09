<script lang="ts">
	import {Navbar, NavBrand, NavLi, NavUl, NavHamburger} from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">CSS360 ATM</span>
	</NavBrand>
	<NavHamburger/>
	<NavUl>
		<NavLi href="/accounts">Accounts</NavLi>
		<NavLi href="/deposit">Deposit</NavLi>
		<NavLi href="/withdraw">Withdraw</NavLi>
	</NavUl>
</Navbar>
