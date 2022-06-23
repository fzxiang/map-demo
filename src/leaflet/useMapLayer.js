import { map, CRS, latLng, latLngBounds, svg } from "leaflet";
import useConfig from "./useConfig";
import { ref } from "vue";
import { getMapConfigApi, getMapFile } from "../api/map";

const [config , setConfig] = useConfig()
const mapRef = ref(null)

async function init() {
	try {
		const result = await getMapConfigApi({
			do: "getConfig",
		})
		const { colour_type_mapping, building_conf, map_server_tile_conf, res_point_conf, map_info } = result
		const { map_height, map_width } = map_info
		// 写入配置数据
		setConfig({
			MaxHeight: map_height,
			MaxWidth: map_width,
			color_type_mapping: colour_type_mapping,
			building_conf,
			res_point_conf,
			map_server_tile_conf
		})
	} catch (e) {
		console.log(e)
	}
}

async function renderMap (elem) {
	await init()

	const { DEFAULT_POS, MaxZoom, MinZoom, MaxHeight, MaxWidth, DEFAULT_ZOOM } = config
	const corner1 = latLng(0,  0)
	const corner2 = latLng(MaxHeight, MaxWidth)
	mapRef.value = map(elem, {
			// preferCanvas: true,
			doubleClickZoom: false,
			crs: CRS.Simple, // 简单坐标系
			attributionControl: false,
			maxBounds: latLngBounds(corner1, corner2),
			renderer: svg({ padding: .8 })
		})
		.setView([DEFAULT_POS[1], DEFAULT_POS[0]], DEFAULT_ZOOM)
		.setMaxZoom(MaxZoom)
		.setMinZoom(MinZoom)
		.on('dragend', ()=>console.log('drag'))
}
export default () => [mapRef, renderMap]


