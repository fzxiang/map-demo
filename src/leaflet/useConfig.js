import { useLocalStorage } from "@vueuse/core";

const localStore = useLocalStorage(
	'game_map',
	{},
)


const config = {
	COLOR: {
		0: 'rgb(0,0,0)',
		1: 'rgb(221,221,221)',
		2: 'rgb(221,221,221)',
		3: 'rgb(221,221,221)'
	},
	TYPE: {
		0: '阻挡点',
		1: '地块类型-城池',
		2: '地块类型-资源点',
		3: '地块类型-玩家主城',
	},
	DEFAULT_POS: localStore.value.DEFAULT_POS ? localStore.value.DEFAULT_POS : [50, 50],
	UID: localStore.value.UID || "",
	GUILD_ID: localStore.value.GUILD_ID || "",
	LEVEL: localStore.value.LEVEL || "3",
	MaxZoom: 7,
	MinZoom: 5,
	MaxWidth: 1000,
	MaxHeight: 1000,
	DEFAULT_ZOOM: 6,
	Offset: .6
}
export default function useConfig() {
	return [config, setConfig]
}

function setConfig(params) {
	Object.assign(config, params)
	if (params.DEFAULT_POS)
		localStore.value.DEFAULT_POS = params.DEFAULT_POS
	if (params.UID)
		localStore.value.UID = params.UID
	if (params.GUILD_ID)
		localStore.value.GUILD_ID = params.GUILD_ID
	if (params.LEVEL)
		localStore.value.LEVEL = params.LEVEL
}
