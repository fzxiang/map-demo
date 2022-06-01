import * as L from 'leaflet'
import useConfig from "./useConfig";
import useInfoLayer from "./useInfoLayer";
import useSearchLayer from "./useSearchLayer";
import useLocationLayer from "./useLocationLayer";
import { watch } from "vue";

const { COLOR, TILE_NUM } = useConfig()

export default function (elem, geoJson) {
	const map = L
		.map(elem, {
			preferCanvas: true,
			crs: L.CRS.Simple, // 简单坐标系
		})
		.setView([TILE_NUM/2, TILE_NUM/2], 6)
		.setMaxZoom(7)
		.setMinZoom(4)


	// 信息层
	const info = useInfoLayer()
	info.addTo(map)

	// GEO层
	const geoLayer = L.geoJSON(geoJson, {
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

	// 搜索层
	const controlSearch = useSearchLayer(geoLayer)
	map.addControl(controlSearch)

	// 跳转层
	const [locationLayer, latlng] = useLocationLayer()
	locationLayer.addTo(map)

	watch(latlng, (newVal) => {
		map.setView(latlng, 5)
	})

	function highlightFeature(e) {
		var layer = e.target;

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
		geoLayer.resetStyle(e.target)
		info.update()
	}

	return {
		geoLayer,
		map
	}

}

