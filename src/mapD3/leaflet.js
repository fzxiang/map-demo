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

export default function (id, geoJson) {

	const bounds = [[0,0], [1000,1000]];

	const map = L
		.map(id, {
			preferCanvas: true,
			crs: L.CRS.Simple, // 简单坐标系
		})
		.setView([5, 5], 6)
		.setMaxZoom(7)
		.setMinZoom(5)

	const geoLayer = L.geoJSON(geoJson, {
		style: function (data) {
			return {
				color: COLOR[data.properties.type]
			};
		},
		filter: function (feature, layer) {
			if (feature.properties) {
				// If the property "underConstruction" exists and is true, return false (don't render features under construction)
				return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
			}
			return false;
		},

		onEachFeature: onEachFeature
	}).addTo(map);

	console.log(geoLayer)

}

function onEachFeature(data, layer) {
	const {
		pos,
		level,
		name,
		owner,
		type,
	} = data.properties
	let str = `<div>${TYPE[type]}</div><div>位置信息: ${pos[0]},${pos[1]} </div>`
	if (name) {
		str += `<div>名称：${name}</div>`
	}
	if (owner) {
		str += `<div>拥有者：${owner}</div>`
	}
	if (level) {
		str += `<div>等级：${name}</div>`
	}
	layer.bindPopup(str);
}
