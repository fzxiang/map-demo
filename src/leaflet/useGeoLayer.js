import * as L from 'leaflet'
import { ref } from "vue";
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";

const { COLOR } = useConfig()
const [info] = useInfoLayer()

const geoLayer = ref(null)
const options = {
	style: (data) => {
		return {
			fillColor: COLOR[data.properties.type],
			// dashArray: '5',
			weight: 2,
			color: 'white'
		};
	},
	filter: (feature, layer) => {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.type !== 2;
		}
		return false;
	},

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
	geoLayer.value.resetStyle(e.target)
	info.update()
}


function setGeoJSON (geoJSON) {
	geoLayer.value = L.geoJSON(geoJSON,options)
}

export default () => [geoLayer, setGeoJSON]

