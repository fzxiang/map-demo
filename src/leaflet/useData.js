import { ref } from "vue";
import { getMapApi } from "../api/map";
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";
import useConfig from "./useConfig";

const dataRef = ref([])
const [config, setConfig, localStore] = useConfig()
const setData = async ({ lat, lng, zoom, boxString }) => {
	const [x0, y0, x1, y1] = boxString.split(',')
	const w = parseInt(x1 - x0 + 15 + "")
	const h = parseInt(y1 - y0 + 10 + "")

	const params = {
		do: 'getMapList'
	}
	params.data = {
		startPosX: lng,
		startPosY: lat,
		lengthX: w,
		lengthY: h,
		zoom,
		uId: localStore.value.UID,
		guildId: localStore.value.GUILD_ID,
	}
	const { result } = await getMapApi(params)
	const json = pos2polygon(result)
	dataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [dataRef, setData]
