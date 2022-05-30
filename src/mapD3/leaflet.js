import * as L from 'leaflet'
import GeoJSON from 'geojson'


// 配置单元格宽度
const RECT_WIDTH = 40

export default function (id, geoJson) {
	const map = L
		.map(id)
		// .setView([39.74739, -105], 13)
		.setView([0, 0], 6);

	// const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	maxZoom: 19,
	// 	attribution: ''
	// }).addTo(map);


	console.log(geoJson)
	geoJson.forEach(item => {
		item.Polygon = [
			[ [-1, -1], [0, -1], [0, 0], [-1, 0], [-1, -1] ],
			[ [0, 0], [1, 0], [1, 1], [0, 1], [0, 0] ],
			[ [1, 1], [2, 1], [2, 2], [1, 2], [1, 1] ],
		]
	})
	var other = GeoJSON.parse(geoJson, { Polygon: 'Polygon' })

	function onEachFeature(feature, layer) {
		let popupContent = '<p>I started out as a GeoJSON ' +
			feature.geometry.type + ', but now I\'m a Leaflet vector!</p>';

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

	var freeBus = [
		{ ...GeoJSON.parse(geoJson, { Polygon: 'Polygon' }) },
	];

	/* global campus, bicycleRental, freeBus, coorsField */

	var freeBusLayer = L.geoJSON(freeBus, {

		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature
	}).addTo(map);

	// const coorsLayer = L.geoJSON(coorsField, {
	//
	// 	pointToLayer: function (feature, latlng) {
	// 		return L.marker(latlng, { icon: baseballIcon });
	// 	},
	//
	// 	onEachFeature: onEachFeature
	// }).addTo(map);


}
