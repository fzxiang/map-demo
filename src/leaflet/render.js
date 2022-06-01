import * as L from 'leaflet'
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";

const { COLOR } = useConfig()


export default function (elem, geoJson) {
	const map = L
		.map(elem, {
			preferCanvas: true,
			crs: L.CRS.Simple, // 简单坐标系
		})
		.setView([5, 5], 6)
		.setMaxZoom(7)
		.setMinZoom(4)

	// 信息层
	const info = useInfoLayer(L)

	info.addTo(map)

	const geoLayer = L.geoJSON(geoJson, {
		style: (data) => {
			return {
				color: COLOR[data.properties.type],
				dashArray: '5',
				weight: 2,
			};
		},
		filter: (feature, layer) => {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: (feature, layer) => {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight
			})
		}
	}).addTo(map);

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 3,
			opacity: .3,
			color: '#00609a',
			dashArray: '',
			// fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}
		info.update(layer.feature.properties);
	}

	function resetHighlight(e) {
		geoLayer.resetStyle(e.target)
		info.update()
	}

	return {
		geoLayer,
		map
	}

}

