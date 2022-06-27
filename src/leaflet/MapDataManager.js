import { getMapFile } from "../api/map";
import useConfig from "./useConfig";

const [config] = useConfig()
export default class MapDataManager {
	static #instance
	static #MASK_BLOCK = 0x8000			// 2个字节最高位是阻挡标识
	static #MASK_STATE_ID = 0x7000	// 13～15位，州ID
	static #MASK_BIND_ID = 0x0FFF		// 1～12位，地块绑定ID
	#mapData = []						// key:pos, value: 16bit value
	#city = {}								// key:pos, value: city conf id
	#initOnce = false

	constructor(params) {
	}

	static async getInstance(){
		if (!MapDataManager.#instance) {
			MapDataManager.#instance = new MapDataManager()
			await MapDataManager.#instance.initOnce()
		}
		return MapDataManager.#instance
	}

	async initOnce () {
		if (this.#initOnce) {
			return true
		}

		const arrayBuffer = await getMapFile()
		const file = new Uint8Array(arrayBuffer)

		let len = file.length
		if (len !== ((config.MaxWidth * config.MaxHeight)*2)) {
			alert('地图数据错误')
		}

		let index = 0
		let value = 0
		let bindId = 0
		let conf = 0
		let shift = 0
		let blockByte = 0			// 地块位数据
		let blockBinary = ""	// 地块字节数据
		for (let i = 0; i < len; i+=2) {
			value = this.getBlockData(file, i)

			// 存入地图数据
			this.#mapData[index] = value

			// 大型城池
			bindId = value & MapDataManager.#MASK_BIND_ID
			if (bindId > 0) {
				conf = config['map_server_tile_conf'][bindId]
				if (conf['configId'] === -1) {
					alert('地图数据错误：' + conf['configId'])
				}
				// 类型为1 是城池
				if(conf['type'] === 1){
					this.#city[index] = conf['configId']
				}
			}

			// 构造二进制阻挡数据
			shift = index % 8
			if ((value & MapDataManager.#MASK_BLOCK) > 0) {
				blockByte |= 1 << shift
			}
			if(shift === 7) {
				blockBinary += String.fromCharCode(blockByte)
				blockByte = 0
			}

			index++
		}


		// 还有剩余的阻挡数据
		// if ((index % 8)  !== 0) {
		// 	blockBinary += String.fromCharCode(blockByte)
		// }


		this.#initOnce = true
		return true
	}


	// 是否阻断
	isBlock(index) {
		const value = this.#mapData[index] || -1
		if ( value === -1 ) {
			return true
		}
		return (value & MapDataManager.#MASK_BLOCK) > 0
	}

	// 获取tile绑定ID(无效返回-1)
	getTileBindId(index) {
		const value = this.#mapData[index] || -1
		if (value === -1 ) {
			return -1
		}

		// 动态阻挡点(如大型城池)，地图数据标志为阻挡
		if((value & MapDataManager.#MASK_BLOCK) > 0 ) {
			const bindId = (value & MapDataManager.#MASK_BIND_ID)
			if (bindId > 0) {
				return bindId
			}
			return -1
		}

		return value & MapDataManager.#MASK_BIND_ID
	}

	// 通过下标获取地块id
	getConfigId(index) {
		const bindId = this.getTileBindId(index)
		if (bindId === -1) {
			return false
		}
		const conf = config.map_server_tile_conf[bindId]
		return conf['configId']
	}

	// 获取资源点配置表信息
	getResPointConf(index) {
		const configId = this.getConfigId(index)
		if (configId === -1) {
			return {}
		}
		return config.res_point_conf[configId]
	}

	// 获取建筑配置表信息
	getBuildConf(index) {
		const configId = this.getConfigId(index)
		if (configId === -1) {
			return {}
		}
		return config.building_conf[configId]
	}

	// 获取建筑形状配置表
	getBuildShape(index) {
		const configId = this.getConfigId(index)
		if (configId === -1) {
			return {}
		}
		const shapeId = config?.building_conf?.[configId]?.shapeId
		if (shapeId < 0) {
			return {}
		}
		return config?.building_shape_conf?.[shapeId]
	}

	getResShape(index) {
		const configId = this.getConfigId(index)
		if (configId === -1) {
			return {}
		}
		const shapeId = config?.res_point_conf?.[configId]?.shapeId
		if (shapeId < 0) {
			return {}
		}
		return config?.building_shape_conf?.[shapeId]
	}

	// 通过下标判断是否资源点
	isResTile(index) {
		const bindId = this.getTileBindId(index)
		if (bindId === -1) {
			return false
		}
		const conf = config.map_server_tile_conf[bindId]
		// 资源点类型为2
		return conf.type === 2
	}

	getCity() {
		return this.#city
	}

	// 是否城池地块
	isCityTile(index) {
		const bindId = this.getTileBindId(index)
		if (bindId === -1) {
			return false
		}
		const conf = config.map_server_tile_conf[bindId]
		return conf.type === 1
	}

	getBlockData (file, idx) {
		let value1 = file[idx + 0]
		let value2 = file[idx + 1 ]
		return ((value1 << 8) + value2)
	}

	// 通过下标获取城池地块资源
	getCityId(index) {
		const bindId = this.getTileBindId(index)
		if (bindId === -1) {
			return false
		}
		const conf = config.map_server_tile_conf[bindId]
		if (conf.type !== 1 ) {
			return -1
		}
		return conf['configId']
	}

	getMapData() {
		return this.#mapData
	}

	// 通过位置获取地图数据下标
	getTileIndex(x, y) {
		return (y * config.MaxWidth + x)
	}

}
