import * as L from 'leaflet'
import { watch } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import useSearchLayer from "./useSearchLayer";
import useLocationLayer from "./useLocationLayer";
import useGeoLayer from "./useGeoLayer";

const { TILE_NUM } = useConfig()

export default function (elem, geoJSON) {
	const map = L
		.map(elem, {
			preferCanvas: true,
			crs: L.CRS.Simple, // 简单坐标系
		})
		.setView([TILE_NUM/2, TILE_NUM/2], 6)
		.setMaxZoom(7)
		.setMinZoom(4)


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
	const [locationLayer, latlng] = useLocationLayer()
	locationLayer.addTo(map)

	watch(latlng, (newVal) => {
		map.setView(latlng, 5)
	})



	return {
		geoLayer,
		map
	}

}

