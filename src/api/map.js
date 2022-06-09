import { serialize } from "../utils/objectToForm";


export const getMapApi = (params) => {
	return fetch('/api/map', {
		method: 'POST',
		body: serialize(params)
	}).then(response => {
		return response.json()
	})
}

