// 信息层
import * as L from "leaflet";
import { ref, unref } from "vue";

const { TYPE } = useConfig()
import useConfig from "./useConfig";

const info = unref(ref(L.control()))

export default function () {

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
			str += `<br>等级：${level}`
		}
		this._div.innerHTML = str
	}

	return [info]
}
