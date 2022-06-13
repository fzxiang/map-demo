// 信息层
import * as L from "leaflet";
import { ref, unref } from "vue";

const [{ TYPE }] = useConfig()
import useConfig from "./useConfig";

const infoRef = ref(L.control())

infoRef.value.onAdd = function (map) {
	const _div = L.DomUtil.create('div', 'info')
	update();
	infoRef.value._div = _div
	return _div
}

function update (props) {
	if (!props) return
	const {
		pos,
		level,
		type,
	} = props
	let str = `<h4>${TYPE[type]}</h4><b>位置信息: ${pos[0]},${pos[1]}</b>`

	if (level) {
		str += `<br>等级：${level}`
	}
	str += '<div class="loading">加载中...</div>'
	infoRef.value._div.innerHTML = str
}

function infoLoading(bool) {
	const elem = infoRef.value._div.getElementsByClassName('loading')[0]
	if (bool) {
		if (elem.style.display === 'none') {
			console.log('display')
			elem.style.display = 'inherit'
		}
	} else {
		elem.style.display = 'none'
	}
}

function appendData (props) {
	if (!props) return
	const { guild_id, guild_name, id, name } = props
	let str = ''
	guild_id && (str += '<br>联盟ID：' + guild_id)
	guild_name && (str += '<br>联盟名称：' + guild_name)
	id && (str += '<br>UID：' + id)
	name && (str += '<br>拥有者：' + name)
	infoRef.value._div.insertAdjacentHTML('beforeend', str)
}
export default () => [infoRef, update, appendData ,infoLoading]
