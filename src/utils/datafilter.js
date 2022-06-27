/**
 * 数据池
 */
import get from 'lodash.get'

// 位置点 -> 打点坐标
// 转数据
export function pos2polygon(data, options = {}) {
	const {
		_w = 'shape[0]',
		_h = 'shape[1]',
		_x = 'pos[0]',
		_y = 'pos[1]',
		margin = 0,
		direction = 'left-bottom',
	} = options
	data.forEach(item => {
		const offset_x = (get(item, _w) || 1)/2 - margin
		const offset_y = (get(item, _h) || 1)/2 - margin
		const center_x = get(item, _x)
		const center_y = get(item, _y)
		item.Polygon = [
			[
				[center_x - offset_x, center_y - offset_y],
				[center_x + offset_x, center_y - offset_y],
				[center_x + offset_x, center_y + offset_y],
				[center_x - offset_x, center_y + offset_y],
			]
		]
	})
	return data
}

// 改对象
export function drawPolygon(item, options = {}) {
	const {
		_w = 'shape[0]',
		_h = 'shape[1]',
		_x = 'pos[0]',
		_y = 'pos[1]',
		margin = .05,//相邻地块间距
	} = options

	const offset_x = (get(item, _w) || 1)/2 - margin
	const offset_y = (get(item, _h) || 1)/2 - margin
	const center_x = get(item, _x)
	const center_y = get(item, _y)
	item.Polygon = [
		[
			[center_x - offset_x, center_y - offset_y],
			[center_x + offset_x, center_y - offset_y],
			[center_x + offset_x, center_y + offset_y],
			[center_x - offset_x, center_y + offset_y],
		]
	]
	return item
}
