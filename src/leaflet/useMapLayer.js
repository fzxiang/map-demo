import * as L from "leaflet";
import useConfig from "./useConfig";
import { ref } from "vue";
import { getMapApi } from "../api/map";

const [config , setConfig] = useConfig()
const mapRef = ref(null)

async function renderMap (elem) {
	try {
		const { result } = await getMapApi({
			do: "getConfig",
		})
		const { colour_type_mapping, map_info } = result
		const { map_height, map_width } = map_info
		setConfig({
			MaxHeight: map_height,
			MaxWidth: map_width,
			color_type_mapping: colour_type_mapping
		})

	} catch (e) {
		console.log(e)
	}

	const { TILE_NUM, MaxZoom, MinZoom, MaxHeight, MaxWidth } = config
	const corner1 = L.latLng(0,  0)
	const corner2 = L.latLng(MaxHeight, MaxWidth)
	mapRef.value = L
		.map(elem, {
			// preferCanvas: true,
			doubleClickZoom: false,
			crs: L.CRS.Simple, // 简单坐标系
			attributionControl: false,
			maxBounds: L.latLngBounds(corner1, corner2)
		})
		.setView([TILE_NUM, TILE_NUM], 4)
		.setMaxZoom(MaxZoom)
		.setMinZoom(MinZoom)
		.on('dragend', ()=>console.log('drag'))
}
export default () => [mapRef, renderMap]
