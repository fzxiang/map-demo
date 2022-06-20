// 信息层
import { DomEvent, DomUtil, control} from "leaflet";

import { ref, unref } from "vue";

const [{ TYPE }] = useConfig()
import useConfig from "./useConfig";

const infoRef = ref(control())

const copyValRef = ref('')
infoRef.value.onAdd = function (map) {
	const _div = DomUtil.create('div', 'info')
	update();
	infoRef.value._div = _div

	DomEvent.on(_div, 'click', async function (e) {
		if (e.target.className === 'copy') {
			var textarea = document.createElement('textarea');
			document.body.appendChild(textarea);
			// 隐藏此输入框
			textarea.style.position = 'fixed';
			textarea.style.clip = 'rect(0 0 0 0)';
			textarea.style.top = '10px';
			// 赋值
			textarea.value = copyValRef.value;
			// 选中
			textarea.select();
			// 复制
			document.execCommand('copy', true);
			// 移除输入框
			document.body.removeChild(textarea);
		}
	})
	return _div
}
const [config] = useConfig()

function update (props) {
	if (!props) return
	const {
		pos,
		type,
		conf_id,
	} = props
	let str = `<h4>${TYPE[type]}</h4><b>位置信息: ${pos[0]},${pos[1]}</b>`

	// 资源和建筑等级读取配置表
	const { res_point_conf, building_conf } = config

	let level = null
	if (type === 1) {
		level = building_conf[conf_id].level
	}	else if (type === 2) {
		level = res_point_conf[conf_id].level
	}

	console.log(props)
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
	const { guild_id, guild_name, id, name, captor_guild_id, captor_guild_name } = props
	let str = ''
	copyValRef.value = id
	id && (str += '<br>UID：' + id + ' <button class="copy">复制</button>')
	name && (str += '<br>拥有者：' + name)
	guild_id && (str += '<br>联盟ID：' + guild_id)
	guild_name && (str += '<br>联盟名称：' + guild_name)
	captor_guild_id && (str += '<br>俘虏同盟Id：' + captor_guild_id)
	captor_guild_name && (str += '<br>俘虏同盟：' + captor_guild_name)
	infoRef.value._div.insertAdjacentHTML('beforeend', str)
}
export default () => [infoRef, update, appendData ,infoLoading]
