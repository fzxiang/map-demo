import { ref } from 'vue'
import { divIcon, latLng, marker } from "leaflet";
import userMapLayer from "./useMap";

const markerLayer = ref(null)
const [mapRef] = userMapLayer()
const setMarker = (options) => {
	const { iconSize } = options
	markerLayer.value = marker([244,105], {
		icon: divIcon({
			className: 'my-div-icon',
			iconSize,
		})
	})
	markerLayer.value.addTo(mapRef.value)
}


export default () => [markerLayer, setMarker]
