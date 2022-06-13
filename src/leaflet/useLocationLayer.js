import * as L from "leaflet";
import { reactive } from "vue";
import userMapLayer from "./useMapLayer";
import useConfig from "./useConfig";
import useGeoLayer from "./useGeoLayer";
import { getMapApi } from "../api/map";

export default function () {

	const [mapRef] = userMapLayer()
	const [config, setConfig, localStore] = useConfig()
	const [geoLayerRef, onMoveEnd] = useGeoLayer()

	const pos = reactive([0, 0])
	const locationLayer = L.control({ position: 'bottomleft' })

	locationLayer.onAdd = function (map) {
		const _div = L.DomUtil.create('div')
		const default_pos = config.DEFAULT_POS.join()
		_div.innerHTML = `
		<div class="location-layer">
			<div class="form-item">
				<div><label>UID：</label><input type="number" name="uId" value="${config.UID}"></div>
				<div><label>联盟：</label><input type="number" name="guildId" value="${config.GUILD_ID}"></div>
				<div><label>等级：</label><input type="text" name="level" placeholder="大于资源地等级" value="${config.LEVEL}"></div>
			</div>
			<button class="search-button">搜索</button>
		</div>
		<div class="location-layer">
			<div class="form-item">
				<div><label>坐标：</label><input type="text" name="pos" value="${default_pos}"></div>
			</div>
			<button class="location-button">跳转</button>
		</div>
`
		L.DomEvent.on(_div, 'click', async function (e) {

			if (e.target.className === 'location-button') {
				const pos = _div.querySelector('input[name=pos]').value.split(',')
				const x = pos[0] || 0
				const y = pos[1] || 0

				const latlng = L.latLng(y, x)
				mapRef.value.setView(latlng, mapRef.value._zoom)
				localStore.value.DEFAULT_POS = [x,y]
				onMoveEnd()
			}
			else if (e.target.className === 'search-button') {
				const [UID, GUILD_ID, LEVEL] = [
					_div.querySelector('input[name=uId]').value,
					_div.querySelector('input[name=guildId]').value,
					_div.querySelector('input[name=level]').value,
				]
				localStore.value.UID = UID
				localStore.value.GUILD_ID = GUILD_ID
				localStore.value.LEVEL = LEVEL

				if (UID) {
					// 根据UID 赋值坐标
					const params = {
						do: "getUserInfo",
						server_id: 1
					}
					params.data = {
						uId: UID
					}
					const { result } = await getMapApi(params)
					if (result.pos) {
						//视图直接定位到改用户地块中心点
						const latlng = L.latLng(result.pos[1], result.pos[0])
						mapRef.value.setView(latlng, mapRef.value._zoom)
						localStore.value.DEFAULT_POS = result.pos
					}
				}

				onMoveEnd()
			}
			L.DomEvent.stopPropagation(e)
			L.DomEvent.preventDefault(e)
		})
		return _div
	}


	return [locationLayer, pos]
}
