import * as L from "leaflet";
import useConfig from "./useConfig";
import { ref } from "vue";

const { TILE_NUM, MaxZoom, MinZoom } = useConfig()
const mapRef = ref(null)

function renderMap (elem) {
	const corner1 = L.latLng(0,  0)
	const corner2 = L.latLng(500, 500)
	mapRef.value = L
		.map(elem, {
			preferCanvas: true,
			doubleClickZoom: false,
			crs: L.CRS.Simple, // 简单坐标系
			attributionControl: false,
			// maxBounds: L.latLngBounds(corner1, corner2)
		})
		.setView([TILE_NUM, TILE_NUM], 4)
		.setMaxZoom(MaxZoom)
		.setMinZoom(MinZoom)
}
export default () => [mapRef, renderMap]
