import { geoJSON } from 'leaflet'
import { ref } from "vue";

const imgLayerRef = ref(null)

const options = {
	style: (data, layer) => {
		const { icon, icon_type } = data.properties
		return {
			weight: 0,
			fillOpacity: 1,
			fill: `url(/icon/${icon}.png)`,
			className: 'pointer-none',
		};
	},
	filter: (feature, layer) => {
		if (feature.properties) {
			const { icon } = feature.properties
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return( icon >= 0 && icon < 1000) || icon > 2000;
		}
		return false;
	},


}

imgLayerRef.value = geoJSON(undefined, options)

console.log(imgLayerRef.value)
export default () => [imgLayerRef]

