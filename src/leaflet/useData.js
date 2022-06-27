import { ref, unref } from "vue";
import { getMapApi } from "../api/map";
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";
import useConfig from "./useConfig";
import useBasicData from "./useBasicData";

const dataRef = ref({})
const [config] = useConfig()
const [basicMapDataRef, setBasicData] = useBasicData()

const setData = async ({ lat, lng, zoom, boxString }) => {
	// 通过参数请求接口 来更改data
	// const [x0, y0, x1, y1] = boxString.split(',')
	// const offset = 1/2**zoom * 1000
	// 根据视图缩放程度 获取不同程度 数据
	// const w = parseInt(x1 - x0 + (offset) + "")
	// const h = parseInt(y1 - y0 + (offset) + "")
	// const params = {
	// 	do: 'getMapList'
	// }
	// params.data = {
	// 	startPosX: lng,
	// 	startPosY: lat,
	// 	lengthX: w,
	// 	lengthY: h,
	// 	zoom,
	// 	uId: config.UID,
	// 	guildId: config.GUILD_ID,
	// 	resLevel: config.LEVEL,
	// }
	// 遍历一次 存储对象map  key: pos[0]_pos[1] value Object  时间复杂度 1n
	// const { result } = await getMapApi(params)
	// const resMap = {}
	// result.forEach(item => {
	// 	const key = item.pos[0] + '_' + item.pos[1]
	// 	resMap[key] = item
	// })
	// 获取地图基础数据
	await setBasicData({
		lat,
		lng,
		zoom,
		boxString,
	})

	const basicMapData = unref(basicMapDataRef)

	// 时间2m
	const basicData = Object.values(basicMapData)
	// basicData.forEach((item,index) => {
	// 	const key = item.pos[0] + '_' + item.pos[1]
	// 	basicData[index] = { ...item, ...resMap[key] }
	// })

	// 总 1n + 2m

	const json = pos2polygon(basicData, {
		// 绘制偏移量
		offset: 2**zoom / 300
	})
	dataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [dataRef, setData]
