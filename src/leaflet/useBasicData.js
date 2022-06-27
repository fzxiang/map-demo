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
	const offset = 10 - zoom
	// 根据视图缩放程度 获取不同程度 数据
	const offSetX = parseInt((offset**2)/2 + "")
	const offSetY = parseInt((offset**2)/2 + "")
	x0 = parseInt(+x0 - offSetX + "")
	y0 = parseInt(+y0 - offSetY + "")
	x1 = parseInt(+x1 + offSetX + "")
	y1 = parseInt(+y1 + offSetY + "")
	// console.log('实例：', instance)
	console.log('坐标信息：', x0, y0, x1, y1)
	console.log('长和宽：', x1-x0, y1-y0)
	// 拼接区域地图数据
	for (let i = x0; i < x1; i++) {
		for (let j = y0; j < y1; j++) {
			// 获取地图数据下标
			const idx = instance.getTileIndex(i,j)
			obj[idx] = {
				pos: [i, j],
				zoom,
			}

			// 是否城池地块
			if (instance.isCityTile(idx)) {
				// console.log('建筑坐标点：', i, j)
				obj[idx].type = 1
				// obj[idx].conf_id = instance.getConfigId(idx)
				obj[idx].level = instance.getBuildConf(idx)?.level
				obj[idx].shape = instance.getBuildShape(idx)?.shape
			}
			// 是否资源地块
			else if (instance.isResTile(idx)) {
				obj[idx].type = 2
				// obj[idx].conf_id = instance.getConfigId(idx)
				obj[idx].level = instance.getResPointConf(idx)?.level
				obj[idx].shape = instance.getResShape(idx)?.shape
			}
			// 是否阻挡点
			else {
				// console.log('阻挡坐标点：', i, j )
				obj[idx].type = 0
				obj[idx].shape = [1,1]
				// obj[idx].conf_id = instance.getConfigId(idx)
			}

			drawPolygon(obj[idx])
		}
	}

	// 这里遍历返回map 对象 用于后面处理数据合并

	const json = Object.values(obj)
	basicMapDataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [basicMapDataRef, setBasicData]

