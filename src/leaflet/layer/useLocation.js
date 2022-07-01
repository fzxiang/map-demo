import { control, DomUtil, DomEvent, latLng} from "leaflet";

import { reactive } from "vue";
import userMapLayer from "./useMap";
import useConfig from "../useConfig";
import useGeoLayer from "./useGeoJSON";
import { getMapUserInfoApi, getMapUserNameApi, getMapGuildsApi } from "../../api/map";

export default function () {

	const [mapRef] = userMapLayer()
	const [config, setConfig] = useConfig()
	const [geoLayerRef, onMoveEnd] = useGeoLayer()

	const pos = reactive([0, 0])
	const locationLayer = control.layers({
		collapsed: true
	}).setPosition('bottomleft')

	locationLayer.onAdd = function (map) {
		const _div = DomUtil.create('div')
		DomEvent.disableClickPropagation(_div)
		const default_pos = config.DEFAULT_POS.join()
		_div.innerHTML = `
		<div class="location-layer-collapsed"><button class="collapsed_btn">▼</button></div>
		<div class="location-layer collapsed" data-collapsed="open">
			<div class="form-item">
				<div><label>用户名</label><input type="text" name="user" value="${config.USER}"></div>
				<div><label>UID</label><input type="number" name="uId" value="${config.UID}"></div>
				<div><label>联盟名</label><input type="text" name="guilds" value="${config.GUILDS}"></div>
				<div><label>联盟ID</label><input type="number" name="guildId" value="${config.GUILD_ID}"></div>
				<div><label>等级</label><input type="text" name="level" placeholder="大于资源地等级" value="${config.LEVEL}"></div>
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
		DomEvent.on(_div, 'click', async function (e) {

			if (e.target.className === 'location-button') {
				const pos = _div.querySelector('input[name=pos]').value.split(',')
				const x = pos[0] || 0
				const y = pos[1] || 0

				const latlng = latLng(y, x)
				mapRef.value.setView(latlng, mapRef.value._zoom)
				setConfig({
					DEFAULT_POS: [x,y],
				})
				onMoveEnd()
			}
			else if (e.target.className === 'search-button') {
				let [USER, GUILDS, UID, GUILD_ID, LEVEL] = [
					_div.querySelector('input[name=user]').value,
					_div.querySelector('input[name=guilds]').value,
					_div.querySelector('input[name=uId]').value,
					_div.querySelector('input[name=guildId]').value,
					_div.querySelector('input[name=level]').value,
				]

				if (USER) {
					const params = {
						// do: "getUserInfo",
						server_id: 1,
						find_user: USER
					}
					const { uId } = await getMapUserNameApi(params)
					_div.querySelector('input[name=uId]').value = uId
					UID = uId
				}
				else if (GUILDS) {
					const params = {
						server_id: 1,
					}
					const guilds = await getMapGuildsApi(params)
					const guild_id = guilds.find(item => item.guild_name === GUILDS)?.guild_id
					if (guild_id) {
						_div.querySelector('input[name=guildId]').value = guild_id
						GUILDS = guild_id
					} else {
						_div.querySelector('input[name=guildId]').value = ""
						GUILDS = ''
					}
				}
				const params = {
					server_id: 1,
				}
				if (UID) {
					// 根据UID 赋值坐标
					params.uId = UID
				}
				else if (GUILD_ID) {
					params.guildId = GUILD_ID

				}
				const result = await getMapUserInfoApi(params)
				if (result.pos) {
					//视图直接定位到改用户地块中心点
					const latlng = latLng(result.pos[1], result.pos[0])
					mapRef.value.setView(latlng, mapRef.value._zoom)
					setConfig({
						DEFAULT_POS: result.pos,
					})
				}

				setConfig({
					USER,
					GUILDS,
					UID,
					GUILD_ID,
					LEVEL
				})

				onMoveEnd()
			}
			else if (e.target.className === 'collapsed_btn' ) {
				const collapsedElem = _div.querySelector('.collapsed')
				if (collapsedElem.dataset.collapsed === 'open') {
					collapsedElem.dataset.collapsed = 'close'
					e.target.innerHTML =  '▲ '
				} else {
					collapsedElem.dataset.collapsed = 'open'
					e.target.innerHTML =  '▼'
				}
			}
			DomEvent.stopPropagation(e)
			DomEvent.preventDefault(e)
		})
		return _div
	}


	return [locationLayer, pos]
}
