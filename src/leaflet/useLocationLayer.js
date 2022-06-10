import * as L from "leaflet";
import { reactive } from "vue";
import userMapLayer from "./useMapLayer";
import useConfig from "./useConfig";
import useGeoLayer from "./useGeoLayer";

import useData from "./useData";

export default function () {

	const [mapRef] = userMapLayer()
	const [{ TILE_NUM }] = useConfig()
	const [geoLayerRef, onMoveEnd] = useGeoLayer()

	const pos = reactive([0, 0])
	const locationLayer = L.control({ position: 'bottomleft' })

	locationLayer.onAdd = function (map) {
		const _div = L.DomUtil.create('div')
		_div.innerHTML = `
		<div class="location-layer">
			<div class="form-item">
				<div><label>UID：</label><input type="number" name="uId" value=""></div>
				<div><label>联盟：</label><input type="number" name="guildId" value=""></div>
			</div>
			<button class="search-button">搜索</button>
		</div>
		<div class="location-layer">
			<div class="form-item">
				<div><label>坐标：</label><input type="text" name="pos" value="0,0"></div>
			</div>
			<button class="location-button">跳转</button>
		</div>
`
		L.DomEvent.on(_div, 'click', function (e) {
			if (e.target.className === 'location-button') {
				const pos = _div.querySelector('input[name=pos]').value.split(',')
				const x = pos[0] || 0
				const y = pos[1] || 0
				console.log(mapRef.value)
				console.log(x, y)

				const latlng = L.latLng(y, x)
				mapRef.value.setView(latlng, mapRef.value._zoom)
				onMoveEnd()
			}
			else if (e.target.className === 'search-button') {
				const [dataRef, setData, extendParams] = useData()
				const [uId, guildId] = [
					_div.querySelector('input[name=uId]').value,
					_div.querySelector('input[name=guildId]').value,
				]

				extendParams.value.uId = uId
				extendParams.value.guildId = guildId
				onMoveEnd()
			}
			L.DomEvent.stopPropagation(e)
			L.DomEvent.preventDefault(e)
		})
		return _div
	}


	return [locationLayer, pos]
}
