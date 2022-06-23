import { serialize } from "../utils/objectToForm";


export const getMapApi = (params) => {
	return fetch('/api/map', {
		method: 'POST',
		body: serialize(params)
	}).then(response => {
		return response.json()
	})
}


export const getMapConfigApi = () => {
	return fetch('/api/mapConfig', {
		method: 'GET',
	}).then(response => {
		return response.json()
	})
}

export const getMapUserInfoApi = (params) => {
	return fetch('/api/mapUserInfo?' + new URLSearchParams(params))
		.then(response => {
			return response.json()
		})
}
