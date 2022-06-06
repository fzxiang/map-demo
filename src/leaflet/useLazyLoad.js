import __useMapLayer from "./useMapLayer";
import { unref } from "vue";


export default function () {
	const [mapLayerRef] = __useMapLayer()
	const map = unref(mapLayerRef)

	const handleEvent = (e) => {
		const { lng: pos_x, lat: pos_y } = map.getCenter()
		console.log(e, pos_x, pos_y)
	}

	map.on('moveend',handleEvent)
}
