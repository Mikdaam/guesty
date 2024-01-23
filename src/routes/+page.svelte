<script lang="ts">
	import { type LatLngExpression } from "leaflet";
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	import LeafletMap from "$lib/components/LeafletMap.svelte";
  	import Marker from "$lib/components/Marker.svelte";
  	import Pin from "$lib/components/Pin.svelte";
	import MarkerPopup from "$lib/components/MarkerPopup.svelte";
  	import ModalSearch from "$lib/components/ModalSearch.svelte";
  	import type { PageData } from "./$types";
			
	interface MarkerPoints {
		cityFullName: string;
		coordinates: [number, number];
	}

	const modalStore = getModalStore();
	const searchModal: ModalComponent = { ref: ModalSearch };

	const modal: ModalSettings = {
		type: 'component',
		component: searchModal,
		// Data
		title: 'Enter City',
		body: 'Where are you from?',
		// Returns the updated response value
		response: (r: string) => console.log('response:', r),
	};

	const initialView: LatLngExpression = [48.85661400000001, 2.3522219]; // view on the hole map
	
	export let data: PageData;
	const points: MarkerPoints[] = data.points as MarkerPoints[];
</script>

<LeafletMap view={initialView} zoom={2}>
	{#each points as point}
		<Marker latLng={point.coordinates} width={25} height={25}>
			<Pin />
			<MarkerPopup>
				{point.cityFullName}
			</MarkerPopup>
		</Marker>
	{/each}

	<button 
		type="button" 
		class="btn-icon btn-icon-xl variant-filled absolute bottom-4 right-4 z-[500]" 
		on:click={() => modalStore.trigger(modal)}
	>
		<div class="w-10 h-10">
			<Pin />
		</div>
	</button>
</LeafletMap>