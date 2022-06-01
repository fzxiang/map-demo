/**
 * 数据池
 */
import get from 'lodash.get'

// 位置点 -> 打点坐标
export function pos2polygon(data, options = {}) {
	const {
		_w = 'rect.w',
		_h = 'rect.h',
		_x = 'pos[0]',
		_y = 'pos[1]',
		direction = 'left-bottom',
	} = options
	data.forEach(item => {
		const w = item.rect ? get(item, _w) : 1
		const h = item.rect ? get(item, _h) : 1
		/**
		 * w 宽度, h:高度, a: x距离左下标距离 b: y距离左下标距离
		 * a = (b-1)/2
		 * x: 左横坐标  y: 左纵坐标
		 * x = x0 +- a
		 * y = y0 +- b
		 */
		const a = (w - 1) / 2
		const b = (h - 1) / 2
		// 左下标
		const x = get(item, _x) - a
		const y = get(item, _y) - b
		if (direction === "left-bottom") {
			item.Polygon = [
				[
					[x/1, y/1],
					[(x + w)/1, y/1],
					[(x + w)/1, (y + h)/1],
					[x/1, (y + h)/1],
					[x/1, y/1],
				]
			]

		} else if (direction === 'top-left') {

		}
	})
	return data
}
