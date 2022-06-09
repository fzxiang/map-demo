import { ref } from "vue";
import { getMapApi } from "../api/map";
import GeoJSON from "geojson";
import { pos2polygon } from "../utils/datafilter";

const dataRef = ref([])
const setData = async ({lat, lng, zoom, boxString}) => {
	const [x0,y0,x1,y1] = boxString.split(',')
	const w = parseInt(x1-x0 + 15 + "")
	const h = parseInt(y1-y0 + 10 + "")

	console.log(w, h)
	console.log(lng, lat,)
	const params = {
		do: 'getMapList'
	}
	params.data = {
		startPosX: parseInt((lng - w/2).toString()),
		startPosY: parseInt((lat - h/2).toString()),
		lengthX: w,
		lengthY: h,
		zoom,
	}
	const { result } = await getMapApi(params)
	const json = pos2polygon(result)
	dataRef.value = GeoJSON.parse(json, {
		Polygon: 'Polygon'
	})
}

export default () => [dataRef, setData]
