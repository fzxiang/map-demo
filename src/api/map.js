import { serialize } from "../utils/objectToForm";
import { getURL } from "../utils";


export const getMapApi = (params) => {
	return fetch(getURL('/api/map'), {
		method: 'POST',
		body: serialize(params)
	}).then(response => {
		return response.json()
	})
}

export const getMapFile = () => {
	return fetch(getURL('/api/mapFile'), {

	}).then(response => {
		return response.arrayBuffer()
	})
}

export const getMapConfigApi = () => {
	return fetch(getURL('/api/mapConfig'), {
		method: 'GET',
	}).then(response => {
		return response.json()
	})
}

export const getMapUserInfoApi = (params) => {
	return fetch(getURL('/api/mapUserInfo?') + new URLSearchParams(params))
		.then(response => {
			return response.json()
		})
}

export const getMapUserNameApi = (params) => {
	return fetch(getURL('/api/mapUser?') + new URLSearchParams(params))
		.then(response => {
			return response.json()
		})
}

export const getMapGuildsApi = (params) => {
	return fetch(getURL('/api/mapGuilds?') + new URLSearchParams(params))
		.then(response => {
			return response.json()
		})
}
