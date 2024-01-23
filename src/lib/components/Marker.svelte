<script lang="ts">
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import L from 'leaflet';
  	import { pinIcon } from '$lib/assets/pin';

	export let width: number;
	export let height: number;
	export let latLng: L.LatLngExpression;
	
	let marker: L.Marker | undefined;
	let markerElement: HTMLElement;
	let iconElement: string = pinIcon

	const { getMap, getMarkerClusterGroup }: { getMap: () => L.Map | undefined, getMarkerClusterGroup: () => L.MarkerClusterGroup | undefined } = getContext('map');
	const map = getMap();
	const markers = getMarkerClusterGroup();

	setContext('layer', {
		// L.Marker inherits from L.Layer
		getLayer: () => marker
	});

	onMount(() => {
		if (map && markers) {
			let icon = L.divIcon({
				html: iconElement,
				className: 'map-marker',
				iconSize: L.point(width, height),
			});

			markers.addLayer(marker = L.marker(latLng, { icon }));
		}
	});

	onDestroy(() => {
		marker?.remove();
		marker = undefined;
	});
</script>

<div bind:this={markerElement}>
	{#if marker}
		<slot />
	{/if}
</div>