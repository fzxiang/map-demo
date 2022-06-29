import { ref } from "vue";
import MapDataManager from "./MapDataManager";

import GeoJSON from "geojson";
import { pos2polygon, drawPolygon  } from "../utils/datafilter";

const basicMapDataRef = ref({})

const setBasicData = async ({ lat, lng, zoom, boxString }) => {
	const instance = await MapDataManager.getInstance()

	// 通过参数 返回指定区块地图数据
	const obj = {}
	let [x0, y0, x1, y1] = boxString.split(',')
	// 数据偏移量
	const offset = (10-zoom)*1.4
	// 根据视图缩放程度 获取不同程度 数据
	const offSetX = parseInt(offset*2 + "")
	const offSetY = parseInt(offset + "")
	x0 = parseInt(+x0 - offSetX + "")
	y0 = parseInt(+y0 - offSetY + "")
	x1 = parseInt(+x1 + offSetX + "")
	y1 = parseInt(+y1 + offSetY + "")

	console.log('实例：', instance)
	console.log('坐标信息：', x0, y0, x1, y1)
	console.log('长和宽：', x1-x0, y1-y0)

	let markEmpty = []
	// 合并 n*m 地块
	const mergeTile = (obj, uni) => {
		if (JSON.stringify(obj[uni].shape) === '[1,1]')
			return false
		const [w, h] = obj[uni].shape
		const [x, y] = obj[uni].pos
		const max_x = x+(w-1)/2
		const min_x = x-(w-1)/2
		const max_y = y+(h-1)/2
		const min_y = y-(h-1)/2
		// 取出左下半区和右上半区
		const arr_1 = []
		const arr_2 = []
		for (let i = min_x; i <= max_x; i++) {
			for (let j = min_y; j <= max_y; j++) {
				if (i < x) arr_1.push(i+'_'+j)
				else if (i > x) arr_2.push(i+'_'+j)
				else if (i === x) {
					if (j < y) arr_1.push(i+'_'+j)
					if (j > y) arr_2.push(i+'_'+j)
				}
			}
		}
		arr_1.forEach(item => obj[item] && delete obj[item])
		arr_2.forEach(item => markEmpty.push(item))
	}
	// 拼接区域地图数据
	console.time('地块生成')
	for (let i = x0; i < x1; i++) {
		for (let j = y0; j < y1; j++) {
			if(markEmpty.includes(i+"_"+j))
				continue;
			// 获取地图数据下标
			const idx = instance.getTileIndex(i,j)
			const uni = i + "_" + j
			obj[uni] = {
				pos: [i, j],
				zoom,
			}

			// 是否城池地块
			if (instance.isCityTile(idx)) {
				// console.log('建筑坐标点：', i, j)
				obj[uni].type = 1
				const buildConf = instance.getBuildConf(idx)
				// obj[uni].conf_id = instance.getConfigId(idx)
				obj[uni].level = buildConf?.level
				obj[uni].icon = buildConf?.id
				obj[uni].icon_type = 'png'
				obj[uni].shape = instance.getBuildShape(idx)?.shape
			}
			// 是否资源地块
			else if (instance.isResTile(idx)) {
				const resPointConf = instance.getResPointConf(idx)
				const level = resPointConf?.level
				if(!level) {
					delete obj[uni]
					continue
				}
				obj[uni].type = 2
				// obj[uni].conf_id = instance.getConfigId(idx)
				obj[uni].level = level
				obj[uni].icon = resPointConf?.id
				obj[uni].icon_type = 'png'
				obj[uni].shape = instance.getResShape(idx)?.shape
			}
			// 是否阻挡点
			else {
				// console.log('阻挡坐标点：', i, j )
				obj[uni].type = 0
				obj[uni].shape = [1,1]
				// obj[uni].conf_id = instance.getConfigId(idx)
			}
			mergeTile(obj,uni)
			obj[uni] && drawPolygon(obj[uni])
		}
	}

	// 这里遍历返回map 对象 用于后面处理数据合并


	const json = GeoJSON.parse(Object.values(obj), {
		Polygon: 'Polygon'
	})

	console.timeEnd('地块生成')

	basicMapDataRef.value = json
}

export default () => [basicMapDataRef, setBasicData]

