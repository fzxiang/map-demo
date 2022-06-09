import useInfoLayer from "./useInfoLayer";
import useSearchLayer from "./useSearchLayer";
import useLocationLayer from "./useLocationLayer";
import useMapLayer from "./useMapLayer";
import useImageLayer from "./useImageLayer";
import("./usePattern")
export default async function (elem) {
	const [mapRef, mapRender] = useMapLayer()
	await mapRender(elem)
	const map = mapRef.value

	// 信息层
	const [info] = useInfoLayer()
	info.addTo(map)

	// GEO层 ps:搜索层中引入了geo
	// const [geoLayerRef] = useGeoLayer()
	// geoLayerRef.value.addTo(map)

	// 搜索层
	const [controlSearch] = useSearchLayer()
	map.addControl(controlSearch)

	// image
	const [imgLayerRef] = useImageLayer()
	imgLayerRef.value.addTo(map)

	// 跳转层
	const [locationLayer] = useLocationLayer()
	locationLayer.addTo(map)

	return {
		map
	}

}

