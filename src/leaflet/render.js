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

	// const myIcon = L.icon({
	// 	iconUrl: '/icon/0.png',
	// 	// iconSize: [100, 100],
	// 	iconAnchor: [22, 94],
	// 	popupAnchor: [-3, -76],
	// 	// shadowUrl: 'my-icon-shadow.png',
	// 	// shadowSize: [68, 95],
	// 	// shadowAnchor: [22, 94]
	// });
	// L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);

	// GEO层
	const [geoLayerRef] = useGeoLayer()
	console.log(map)
	geoLayerRef.value.addTo(map)


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

