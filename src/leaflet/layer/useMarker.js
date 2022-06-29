import { ref } from 'vue'
import { divIcon, marker } from "leaflet";

const markerLayer = ref(null)
// markerLayer.value = ref(marker([0,0], {
// 	icon: divIcon({
// 		className: 'my-div-icon',
// 		iconSize: [64,64],
// 	})
// }))

const setMarker = (options) => {
	const { iconSize } = options
	markerLayer.value = marker([244,105], {
		icon: divIcon({
			className: 'my-div-icon',
			iconSize,
		})
	})
}


export default () => [markerLayer, setMarker]
