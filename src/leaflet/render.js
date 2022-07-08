import { popup, marker, latLng, divIcon } from "leaflet";
import useInfoLayer from "./layer/useInfo";
import useSearchLayer from "./layer/useSearch";
import useLocationLayer from "./layer/useLocation";
import useMapLayer from "./layer/useMap";
import useImageLayer from "./layer/useImage";
import useGeoLayer from "./layer/useGeoJSON";
import useMarkerLayer from "./layer/useMarker";

import usePattern from "./usePattern";
export default async function (elem) {
	usePattern()
	const [mapRef, renderMap] = useMapLayer()
	await renderMap(elem)
	const map = mapRef.value


	// 信息层
	const [infoRef] = useInfoLayer()
	infoRef.value.addTo(map)

	// GEO层 ps:搜索层中引入了geo
	const [geoLayerRef] = useGeoLayer()
	geoLayerRef.value.addTo(map)

	// 搜索层
	// const [controlSearch] = useSearchLayer()
	// map.addControl(controlSearch)

	// image
	const [imgLayerRef] = useImageLayer()
	imgLayerRef.value.addTo(map)

	// 跳转层
	const [locationLayer] = useLocationLayer()
	locationLayer.addTo(map)

	// div icon 层
	const [markerLayer, setMarker ] = useMarkerLayer()
	setMarker({
		iconSize: [64, 64]
	})

	map.on('click', (e, layer) => {
		let { lat, lng } = e.latlng
		lat = lat.toFixed()
		lng = lng.toFixed()
		markerLayer.value.setLatLng(latLng(lat,lng))
		markerLayer.value.bindTooltip(`空地位置坐标: ${lng}, ${lat}` ).openTooltip()
	})


	return {
		map
	}

}

