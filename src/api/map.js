import { serialize } from "../utils/objectToForm";


export const getMapApi = (params) => {
	return fetch('/api/map', {
		method: 'POST',
		body: serialize(params)
	}).then(response => {
		return response.json()
	})
}

export const getMapFile = () => {
	return fetch('/api/mapFile', {

	}).then(response => {
		return response.arrayBuffer()
	})
}

export const getMapConfigApi = () => {
	return fetch('/api/mapConfig', {
		method: 'GET',
	}).then(response => {
		return response.json()
	})
}
