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
	let [x0, y0, x1, y1] = boxString.split(',')
	// 数据偏移量
	// 根据视图缩放程度 获取不同程度 数据
	const offSetX = parseInt((x1 - x0)*config.Offset + "")
	const offSetY = parseInt((y1 - y0)*config.Offset + "")
	x0 = parseInt(+x0 - offSetX + "")
	y0 = parseInt(+y0 - offSetY + "")
	x1 = parseInt(+x1 + offSetX + "")
	y1 = parseInt(+y1 + offSetY + "")
	// 根据视图缩放程度 获取不同程度 数据
	const w = parseInt(x1 - x0  + "")
	const h = parseInt(y1 - y0  + "")
	const params = {
		do: 'getMapList'
	}
	params.data = {
		startPosX: lng,
		startPosY: lat,
		lengthX: w,
		lengthY: h,
		zoom,
		uId: config.UID,
		guildId: config.GUILD_ID,
		resLevel: config.LEVEL,
	}
	// 遍历一次 存储对象map  key: pos[0]_pos[1] value Object  时间复杂度 1n
	const { result } = await getMapApi(params)

	// 获取地图基础数据
	await setBasicData({
		x0,
		y0,
		x1,
		y1,
		zoom,
		boxString,
	})

	const basicMapData = unref(basicMapDataRef)

	result.forEach(item => {
		const key = item.pos[0] + '_' + item.pos[1]
		basicMapData[key] = {
			...basicMapData[key],
			...item
		}
	})

	// 总 1n + 2m

	const json = pos2polygon(Object.values(basicMapData))
	dataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [dataRef, setData]
