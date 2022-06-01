import * as L from "leaflet";
import { reactive } from "vue";

export default function () {

	const latlng = reactive([0, 0])
	const locationLayer = L.control({ position: 'bottomleft'})

	locationLayer.onAdd = function (map) {
		const _div = L.DomUtil.create('div', 'location-layer')
		let str =
			`<div class="form-item">
				<div><label>X坐标：</label><input type="number" name="pos_x" value="0"></div>
				<div><label>Y坐标：</label><input type="number" name="pos_y" value="0"></div>
			</div>
			<button class="location-button">跳转</button>
`
		_div.innerHTML = str
		L.DomEvent.on(_div, 'click', function (e) {
			if (e.target.className === 'location-button') {
				const [pos_x, pos_y] = [
					_div.querySelector('input[name=pos_x]').value,
					_div.querySelector('input[name=pos_y]').value,
				]
				latlng[1] = + pos_x || 0
				latlng[0] = + pos_y || 0
			}
		})
		return _div
	}




	return [ locationLayer, latlng ]
}
