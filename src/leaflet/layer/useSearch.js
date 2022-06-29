import { Control } from "leaflet";
import * as LS from 'leaflet-search'
import useGeoLayer from "./useGeoJSON";

export default function () {
	const [geoLayerRef] = useGeoLayer()
	const geoLayer = geoLayerRef.value
	// 搜索层
	const controlSearch = new Control.Search({
		position:'topleft',
		layer: geoLayer,
		initial: false,
		propertyName: 'pos',
		textErr: '在已加载数据中,没有找到',
		textPlaceholder: '查找资源',
		marker: false,
		moveToLocation: (latlng, title, map) => {
			const zoom = map.getBoundsZoom(latlng.layer.getBounds());
			map.setView(latlng, zoom); // access the zoom
		}
	});

	controlSearch.on('search:locationfound', function(e) {
		e.layer.setStyle({
			weight: 3,
			opacity: 1,
			fillColor: '#06a2ff',
		});
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {
		geoLayer.eachLayer(function(layer) {
			//restore feature color
			geoLayer.resetStyle(layer);
		});
	});

	return [controlSearch]
}
