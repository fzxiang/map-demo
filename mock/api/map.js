import GeoJSON from 'geojson'

const data = [
	// {
	// 	x: 0.5,
	// 	y: 102.0,
	// 	prop0: 'value0'
	// },
	// {
	// 	line: [[102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0], [102.0, 0.0]],
	// 	prop0: 'value0',
	// 	prop1: 0.0
	// },
	{
		polygon: [
			[[100, 0], [110, 0], [110, 10], [100,10], [100, 0] ],
			// [[10, 0], [20, 0], [20, 10], [10,10], [10, 0] ],
		],
		prop0: 'value0',
		prop1: {"this": "that"}
	},
	{
		polygon: [
			[[10, 0], [20, 0], [20, 10], [10,10], [10, 0] ],
		],
		prop0: 'value1',
		prop1: {"this": "ddd"}
	}
];
const json = GeoJSON.parse(data, {'Point': ['x', 'y'], 'LineString': 'line', 'Polygon': 'polygon'})

function resultSuccess(result, { message = 'ok' } = {}) {
	return {
		code: 0,
		result,
		message,
		type: 'success',
	};
}

export default [{
	url: '/api/map',
	timeout: 1000,
	method: 'post',
	response: () => {
		// return resultSuccess(json);
		return resultSuccess([
			{
				"pos": [
					151,
					151
				],
				"rect": {
					w: 3,
					h: 3
				},
				"center_pos": -1,
				"type": 2,
				"owner": "",
				"name": "",
				"icon": 0,
				"level": 2,
				"colour_type": 0
			},
			{
				"pos": [
					155,
					155
				],
				"center_pos": -1,
				"type": 2,
				"owner": "",
				"name": "",
				"icon": 0,
				"level": 2,
				"colour_type": 0
			},
		])
	},
},]
