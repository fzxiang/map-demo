const config =  {
	COLOR: {
		0: 'rgb(0,0,0)',
		1: 'rgb(241,229,187)',
		2: 'rgb(140,194,136)',
		3: 'rgb(230,131,63)'
	},
	TYPE: {
		0: '阻挡点',
		1: '地块类型-城池',
		2: '地块类型-资源点',
		3: '地块类型-玩家主城',
	}
}
export default function useConfig() {
	return config
}
