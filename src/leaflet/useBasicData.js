import { ref } from "vue";
import MapDataManager from "./MapDataManager";

import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";
import useConfig from "./useConfig";


const basicDataRef = ref([])
const [config] = useConfig()

const instance = MapDataManager.getInstance()
const setBasicData = async ({ lat, lng, zoom, boxString }) => {
	const params = {}
	// 通过参数 返回指定区块地图数据
	const [x0, y0, x1, y1] = boxString.split(',')
	const w = parseInt(x1 - x0 + 15 + "")
	const h = parseInt(y1 - y0 + 10 + "")


	console.log('setBasicData', instance)
	// const json = pos2polygon(result)
	// basicDataRef.value = GeoJSON.parse(json, {
	// 	Polygon: 'Polygon'
	// })
}

export default () => [basicDataRef, setBasicData]

