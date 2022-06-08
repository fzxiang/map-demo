import useInfoLayer from "./useInfoLayer";
import useSearchLayer from "./useSearchLayer";
import useLocationLayer from "./useLocationLayer";
import useGeoLayer from "./useGeoLayer";
import useMapLayer from "./useMapLayer";

export default async function (elem) {
	const [mapRef, mapRender] = useMapLayer()
	await mapRender(elem)
	console.log('await map')
	const map = mapRef.value

	// 信息层
	const [info] = useInfoLayer()
	info.addTo(map)

	// GEO层
	useGeoLayer()

	// 搜索层
	const [controlSearch] = useSearchLayer()
	map.addControl(controlSearch)

	// 跳转层
	const [locationLayer] = useLocationLayer()
	locationLayer.addTo(map)

	return {
		map
	}

}

