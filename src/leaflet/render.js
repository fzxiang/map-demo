import * as L from 'leaflet'
import { toRefs, watch } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import useSearchLayer from "./useSearchLayer";
import useLocationLayer from "./useLocationLayer";
import useGeoLayer from "./useGeoLayer";
import userMapLayer from "./useMapLayer";



export default function (elem, geoJSON) {
	const [mapRef, mapRender] = userMapLayer()
	mapRender(elem)
	const map = mapRef.value

	// 信息层
	const [info] = useInfoLayer()
	info.addTo(map)

	// GEO层
	const [geoLayerRef, setGeoJSON] = useGeoLayer()
	setGeoJSON(geoJSON)
	const geoLayer = geoLayerRef.value
	geoLayer.addTo(map);

	// 搜索层
	const [controlSearch] = useSearchLayer()
	map.addControl(controlSearch)

	// 跳转层
	const [locationLayer] = useLocationLayer()
	locationLayer.addTo(map)

	// watch(pos, () => {
	// 	const latlng = L.latLng(pos[0], pos[1])
	// 	console.log(latlng)
	// 	map.setView(latlng, 5)
	// })

	return {
		geoLayer,
		map
	}

}

