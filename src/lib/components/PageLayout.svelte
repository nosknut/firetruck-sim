<script>
	import { DarkMode } from 'flowbite-svelte';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
</script>

<div class="relative">
	<Navbar
		navClass="px-2 sm:px-4 py-2.5 absolute w-full z-20 top-0 left-0 border-b"
		let:hidden
		let:toggle
	>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
				>Firetruck Sim</span
			>
		</NavBrand>
		<div class="flex md:order-2 gap-2">
			<slot name="nav-actions" />
			<DarkMode />
			<NavHamburger on:click={toggle} />
		</div>
		<NavUl {hidden} class="order-1">
			<NavLi href="/">Home</NavLi>
			<NavLi href="/">Firetruck</NavLi>
		</NavUl>
	</Navbar>

	<div class="h-screen w-screen pt-16">
		<div class="overflow-auto h-full">
			<slot />
		</div>
	</div>
</div>
