import { ref } from "vue";
import { getMapApi } from "../api/map";
import useConfig from "./useConfig";
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";

const dataRef = ref([])
const setData = async ({lat, lng, zoom}) => {
	const [{ TILE_NUM }] = useConfig()
	const params = {
		do: 'getMapList'
	}
	params.data = {
		startPosX: parseInt((lng - TILE_NUM).toString()),
		startPosY: parseInt((lat - TILE_NUM/2).toString()),
		lengthX: TILE_NUM * 2,
		lengthY: TILE_NUM,
		zoom,
	}
	const { result } = await getMapApi(params)
	const json = pos2polygon(result)
	dataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [dataRef, setData]
