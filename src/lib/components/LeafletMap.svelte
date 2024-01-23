<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher, tick } from 'svelte';
	import L from 'leaflet';

	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/leaflet.markercluster.js';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

	export let bounds: L.LatLngBoundsExpression | undefined = undefined;
	export let view: L.LatLngExpression | undefined = undefined;
	export let zoom: number | undefined = undefined;

	const api_key: string = 'XcKG0RfpllDEYzowWUeo'
	const dispatch = createEventDispatcher();
	const layerOptions = {
        attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
        noWrap: true,
        tileSize: 512,
        zoomOffset: -1,
        minZoom: 2,
		maxZoom: 12,
        crossOrigin: true,
    };

	const clusterOptions = {
		spiderfyOnMaxZoom: false,
		showCoverageOnHover: false,
	}

	let map: L.Map | undefined;
	let mapElement: HTMLElement;
	let markers: L.MarkerClusterGroup;

	onMount(() => {
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		map = L.map(mapElement)
			// example to expose map events to parent components:
			.on('zoom', (e) => dispatch('zoom', e))
			.on('popupopen', async (e) => {
				await tick();
				e.popup.update();
			});

		L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${api_key}`, layerOptions).addTo(map);

		markers = L.markerClusterGroup(clusterOptions);
    	map.addLayer(markers);
	});

	onDestroy(() => {
		map?.remove();
		map?.removeLayer(markers);
		markers?.clearLayers();
		map = undefined;
	});

	setContext('map', {
		getMap: () => map,
		getMarkerClusterGroup: () => markers,
	});

	$: if (map) {
		if (bounds) {
			map.fitBounds(bounds);
		} else if (view && zoom) {
			map.setView(view, zoom);
		}
	}
</script>

<div class="w-full h-full" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>
