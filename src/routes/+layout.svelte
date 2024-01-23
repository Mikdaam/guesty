<script lang="ts">
	import '../app.postcss';
	import { initializeStores, AppShell, Modal, storePopup, Toast } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
  	import Search from '$lib/components/Search.svelte';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<Toast />
<Modal />

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-96 p-4">
	<!-- Left Sidebar -->
	<svelte:fragment slot="sidebarLeft">
		<!-- Header -->
		<header class="border-b border-surface-500/30 p-4">
			<Search />
		</header>

		<!-- List -->
		<div class="p-4 space-y-4 overflow-y-auto">
			<small class="opacity-50">Cities</small>
			<div class="flex flex-col space-y-1">
			</div>
		</div>
	</svelte:fragment>

	<!-- Page Route Content -->
	<slot />
</AppShell>
