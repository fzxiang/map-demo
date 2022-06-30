import { DomUtil, geoJSON, DomEvent } from "leaflet"
import { ref } from "vue";
import useConfig from "../useConfig";
import useInfoLayer from "./useInfo";
import useData from "../useData";
import useImageLayer from "./useImage";
import { getMapApi } from "../../api/map";
import debounce from "lodash.debounce";

const [config] = useConfig()
const [infoRef, update, appendData, infoLoading] = useInfoLayer()
const [dataRef, setData] = useData()
const mapRef = ref(null)

const geoLayerRef = ref(null)

const [imgLayerRef] = useImageLayer()


const options = {
	style: (data) => {
		const { COLOR, color_type_mapping } = config
		const { colour_type: color_type, type, level, zoom } = data.properties

		let fillColor = '#ddd'
		let fillOpacity = 1
		// 有分阵营角色颜色
		const hasExtend = !!(config.UID || config.GUILD_ID)

		if (hasExtend) {
			if (color_type_mapping[color_type])
				fillColor = color_type_mapping[color_type]
		}
		else {
			fillColor = COLOR[type]
			if (type === 2 && color_type === 0) {
				fillOpacity = level / 5
			}
			// 城墙
			else if (type === 0) {
				fillOpacity = .4
			}
		}
		if (type === 0) {
			fillColor = COLOR[type]
			fillOpacity = .4
		}
		return {
			fillColor,
			fillOpacity,
			// dashArray: '5',
			weight: 1,
			color: '#fff'
		};
	},
	// filter: (feature, layer) => {
	// 	if (feature.properties) {
	// 		// If the property "underConstruction" exists and is true, return false (don't render features under construction)
	// 		return feature.properties.type !== 2;
	// 	}
	// 	return false;
	// },

	onEachFeature: (feature, layer) => {
		layer.on({
			click: highlightFeature,
			// dblClick: resetHighlight
		})
	}
}

// 使用防抖器, 请求接口并加载地块其它信息
let properties = null
const loadOthers = debounce(async () => {
	try {
		const [posX, posY] = properties.pos
		const { result } = await getMapApi({
			do: 'getTileInfo',
			server_id: 1,
			data: {
				posX: posX,
				posY: posY
			}
		})
		if (result.owner.length !== 0) {
			appendData(result.owner)
		}
	} catch (e) {
		console.error(e)
	} finally {
		infoLoading(false)
	}


}, 800)

function highlightFeature(e) {
	DomEvent.stopPropagation(e);
	const layer = e.target;
	geoLayerRef.value.resetStyle()
	layer.setStyle({
		opacity: 1,
		color: '#f8a100',
		weight: 3,
		fillColor: '#f8be00',
		fillOpacity: .6
	});
	layer.bringToFront()
	imgLayerRef.value.bringToFront()
	properties = layer.feature.properties
	update(layer.feature.properties);
	infoLoading(true)
	loadOthers()
}

function resetHighlight(e) {
	geoLayerRef.value.resetStyle(e.target)
	// update() 10001064769
}

// 视图拖动事件
const onMoveEnd = debounce(async (e) => {
	// 放大缩小是 清除图片<defs>
	if (e){
		if (e.type === 'zoomend'){
			const imgElems = e.target._container.querySelectorAll('defs image')
			// 更改资源图 宽高
			imgElems.forEach(item => {
				const w = item.getAttribute('w')
				const h = item.getAttribute('h')
				item.setAttribute('width', 2**e.target._zoom*w)
				item.setAttribute('height', 2**e.target._zoom*h)
			})
		}
	}
	// 		if (e.target._container.querySelector('defs'))
	// 			// DomUtil.empty(e.target._container.querySelectorAll('defs')[0])
	const _map = mapRef.value;
	const bounds = _map.getBounds();
	const boxString = bounds.toBBoxString()
	const zoom = _map.getZoom();
	const { lat, lng } = bounds.getCenter()
	console.log('数据变化前')
	// 前端处理基础地图数据
	await setData({
		lat,
		lng,
		zoom,
		boxString,
	})

	let data = dataRef.value

	geoLayerRef.value.clearLayers();//if needed, we clean the layers

	//Then we add the new data
	geoLayerRef.value.addData(data);

	// image
	imgLayerRef.value.clearLayers()
	imgLayerRef.value.addData(data)
}, 150)


const geoJSONLayer = geoJSON(undefined, options)
geoJSONLayer.onAdd = async (map) => {
	mapRef.value = map
	onMoveEnd()
	map.on('dragend', onMoveEnd, this);
	map.on('zoomend', onMoveEnd, this);
	map.on('refresh', onMoveEnd, this);
}


geoLayerRef.value = geoJSONLayer

export default () => [geoLayerRef, onMoveEnd]

