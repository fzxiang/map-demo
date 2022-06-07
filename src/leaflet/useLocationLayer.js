import * as L from "leaflet";
import { reactive } from "vue";
import userMapLayer from "./useMapLayer";
import useConfig from "./useConfig";
import useGeoLayer from "./useGeoLayer";

export default function () {

	const [mapRef] = userMapLayer()
	const { TILE_NUM } = useConfig()
	const [geoLayerRef] = useGeoLayer()

	const pos = reactive([0, 0])
	const locationLayer = L.control({ position: 'bottomleft' })

	locationLayer.onAdd = function (map) {
		const _div = L.DomUtil.create('div', 'location-layer')
		_div.innerHTML = `<div class="form-item">
				<div><label>X坐标：</label><input type="number" name="pos_x" value="0"></div>
				<div><label>Y坐标：</label><input type="number" name="pos_y" value="0"></div>
			</div>
			<button class="location-button">跳转</button>
`
		L.DomEvent.on(_div, 'click', function (e) {
			if (e.target.className === 'location-button') {
				const [pos_x, pos_y] = [
					_div.querySelector('input[name=pos_x]').value,
					_div.querySelector('input[name=pos_y]').value,
				]
				pos[0] = +pos_x || 0
				pos[1] = +pos_y || 0

				const latlng = L.latLng((pos[1] + TILE_NUM / 2), (pos[0] + TILE_NUM / 2))
				mapRef.value.setView(latlng, 4)
				geoLayerRef.value.onMoveEnd()
			}
		})
		return _div
	}


	return [locationLayer, pos]
}
