import * as L from 'leaflet'

const COLOR = {
	0: 'rgb(0,0,0)',
	1: 'rgb(241,229,187)',
	2: 'rgb(140,194,136)',
	3: 'rgb(230,131,63)'
}

const TYPE = {
	0: '阻挡点',
	1: '地块类型-城池',
	2: '地块类型-资源点',
	3: '地块类型-玩家主城',

}

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
	const info = L.control()

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info')
		this.update();
		return this._div
	}
	info.update = function (props) {
		if (!props) return
		const {
			pos,
			level,
			name,
			owner,
			type,
		} = props
		let str = `<h4>${TYPE[type]}</h4><b>位置信息: ${pos[0]},${pos[1]}</b>`
		if (name) {
			str += `<br>名称：${name}`
		}
		if (owner) {
			str += `<br>拥有者：${owner}`
		}
		if (level) {
			str += `<br>等级：${name}`
		}
		this._div.innerHTML = str
	}

	info.addTo(map)

	const geoLayer = L.geoJSON(geoJson, {
		style: (data) => {
			return {
				color: COLOR[data.properties.type]
			};
		},
		filter: (feature, layer) => {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature
	}).addTo(map);

	return {
		geoLayer,
		map
	}



	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight
		})
	}


// get color depending on population density value
// 	function getColor(d) {
// 		return d > 1000 ? '#800026' :
// 			d > 500  ? '#BD0026' :
// 				d > 200  ? '#E31A1C' :
// 					d > 100  ? '#FC4E2A' :
// 						d > 50   ? '#FD8D3C' :
// 							d > 20   ? '#FEB24C' :
// 								d > 10   ? '#FED976' :
// 									'#FFEDA0';
// 	}
//
// 	function style(feature) {
// 		return {
// 			weight: 2,
// 			opacity: 1,
// 			color: 'white',
// 			dashArray: '3',
// 			fillOpacity: 0.7,
// 			fillColor: getColor(feature.properties.density)
// 		};
// 	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
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

}

