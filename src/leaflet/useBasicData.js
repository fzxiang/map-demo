import { ref } from "vue";
import MapDataManager from "./MapDataManager";

import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";
import useConfig from "./useConfig";


const basicDataRef = ref([])
const [config] = useConfig()

const setBasicData = async ({ lat, lng, zoom, boxString }) => {
	const instance = await MapDataManager.getInstance()
	// console.log('setBasicData', instance.getCity()[22560])

	// 通过参数 返回指定区块地图数据
	const result = []
	let index = 0
	let [x0, y0, x1, y1] = boxString.split(',')
	x0 = parseInt(x0)
	y0 = parseInt(y0)
	x1 = parseInt(x1)
	y1 = parseInt(y1)
	// 拼接区域地图数据
	for (let i = x0; i < x1; i++) {
		for (let j = y0; j < y1; j++) {
			result[index] = {
				pos: [i, j],
			}
			if (instance.isCityTile(i,j)) {
				result[index].type = 1
			} else if (instance.isResTile(i,j)) {
				result[index].type = 2
			} else {
				result[index].type = 0
			}
			index ++
		}
	}

	console.log(instance)
	console.log(result)
	// const json = pos2polygon(result)
	// basicDataRef.value = GeoJSON.parse(json, {
	// 	Polygon: 'Polygon'
	// })
}

export default () => [basicDataRef, setBasicData]

