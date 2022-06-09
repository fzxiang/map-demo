import * as L from 'leaflet'
import { ref } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import lazyLoad from "./lazyLoad";

const [config] = useConfig()
const [info] = useInfoLayer()

const geoLayerRef = ref(null)
const options = {
	style: (data) => {
		const { COLOR, color_type_mapping } = config
		const { colour_type: color_type, type, level } = data.properties
		let fillColor = ''
		let fillOpacity = .6
		// 有分阵营角色颜色
		color_type ?
			fillColor = color_type_mapping[color_type] :
			fillColor = COLOR[type]
		if(type === 2) {
			fillOpacity = level / 5
		} else if (type === 0) {
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

function highlightFeature(e) {
	const layer = e.target;

	layer.setStyle({
		weight: 3,
		opacity: 1,
		color: '#f8be00',
		fillColor: '#f8be00',
		fillOpacity: .6
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geoLayerRef.value.resetStyle(e.target)
	info.update()
}


geoLayerRef.value = lazyLoad({
	// light: true
}, options)
console.log(geoLayerRef)

export default () => [geoLayerRef]

