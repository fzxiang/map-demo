import * as L from 'leaflet'
import { ref } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import useData from "./useData";
import useImageLayer from "./useImageLayer";
import { getMapApi } from "../api/map";
import debounce from "lodash.debounce";

const [config] = useConfig()
const [infoRef, update,  appendData ,infoLoading] = useInfoLayer()
const [dataRef, setData, extendParams] = useData()
const mapRef= ref(null)

const geoLayerRef = ref(null)

const [imgLayerRef] = useImageLayer()


const options = {
	style: (data) => {
		const { COLOR, color_type_mapping } = config
		const { colour_type: color_type, type, level } = data.properties
		let fillColor = ''
		let fillOpacity = .6
		// 有分阵营角色颜色
		const hasExtend = !!(extendParams.value.uId || extendParams.value.guildId)

		if (hasExtend) {
			fillColor = color_type_mapping[color_type]
		} else {
			fillColor = COLOR[type]
			if(type === 2 && color_type === 0) {
				fillOpacity = level / 5
			}
			// 城墙
			else if (type === 0) {
				fillOpacity = .4
			}
		}
		if (type === 0 ) {
			fillColor = COLOR[type]
			fillOpacity = .4
		}
		return {
			fillColor,
			fillOpacity,
			// dashArray: '5',
			weight: 1,
			color: 'white'
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
			mouseover: highlightFeature,
			mouseout: resetHighlight
		})
	}
}

// 使用防抖器, 请求接口并加载地块其它信息
let properties = null
const loadOthers = debounce(async (properties)=>{
	const res = await getMapApi({
		do: 'getConfig'
	})
	infoLoading(false)
}, 800)
function highlightFeature(e) {
	const layer = e.target;

	layer.setStyle({
		weight: 3,
		opacity: 1,
		color: '#f8be00',
		fillColor: '#f8be00',
		fillOpacity: .6
	});
	properties = layer.feature.properties
	update(layer.feature.properties);
	infoLoading(true)
	loadOthers()

}

function resetHighlight(e) {
	geoLayerRef.value.resetStyle(e.target)
	update()
}

async function onMoveEnd(e) {
	if (e) {
		if(e.type === 'zoomend') {
			// 放大缩小是 清除图片<defs>
			console.log(e.type)
			L.DomUtil.empty(e.target._container.querySelectorAll('defs')[0])
		}
	}
	const _map = mapRef.value;
	const bounds = _map.getBounds();
	const boxString = bounds.toBBoxString()
	const zoom =  _map.getZoom();
	const { lat, lng } = bounds.getCenter()
	console.log('数据变化前')
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
}

const geoJSONLayer = L.geoJSON(undefined, options)
geoJSONLayer.onAdd = async (map) => {
	mapRef.value = map
	await onMoveEnd()
	map.on('dragend', onMoveEnd, this);
	map.on('zoomend', onMoveEnd, this);
	map.on('refresh', onMoveEnd, this);
}



geoLayerRef.value = geoJSONLayer

export default () => [geoLayerRef, onMoveEnd]

