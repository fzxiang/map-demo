import * as L from 'leaflet'
import { ref } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import { pos2polygon } from "../utils/datafilter";
import GeoJSON from "geojson";
import lazyLoad from "./lazyLoad";

const { COLOR } = useConfig()
const [info] = useInfoLayer()

const geoLayerRef = ref(null)
const options = {
	style: (data) => {
		return {
			fillColor: COLOR[data.properties.type],
			// dashArray: '5',
			weight: 2,
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
		weight: 4,
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


export default () => {
	geoLayerRef.value = lazyLoad({
		endpoint: "/map/api",
		debug: true,
		parameters: {
			"do": "getMapList",
		},
		transformData: (res) => {
			const json = pos2polygon(res.result)
			return GeoJSON.parse(json, {
				Polygon: 'Polygon'
			})
		}
	}, options)

	return [geoLayerRef]
}

