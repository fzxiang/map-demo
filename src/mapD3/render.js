import * as d3 from 'd3'

window.d3 = d3
// 配置单元格宽度
const RECT_WIDTH = 40

export default function (elem, geoJson) {
	/**
	 * 基本配置
	 */

	console.log(geoJson)
	const svg = d3.create('svg')
	const svgWidth = elem.offsetWidth;
	const svgHeight = elem.offsetHeight;
	const padding = 30;
	svg.attr("height", svgHeight)
	svg.attr("width", svgWidth);

	const mapContainer = svg.append("g")

	const shapes = mapContainer.selectAll(".shapes").data(geoJson).enter()

	const len = Math.sqrt(geoJson.length)
	shapes.append("rect")
		// 坐标根据单元格宽度重新计算
		.attr("x", (d, i) => {
			return ~~(i / len) * RECT_WIDTH + d.pos[0];

		})
		.attr("y", (d, i) => {
			return (i - ~~(i/len)*len) * RECT_WIDTH + d.pos[1];
		})
		.attr("width", RECT_WIDTH)
		.attr("height", RECT_WIDTH);

	function zoomed() {
		const t = d3.event.transform;
		svg.attr("transform", `translate(${t.x}, ${t.y}) scale(${t.k})`); //改变mapContainer的位置及缩放
	}

	const zoom = d3.zoom()
		.scaleExtent([1, 5])  //设置监听范围
		.on("zoom", zoomed);  //设置监听事件

	// svg.call(zoom); //仍然应用于svg上，但是事件触发时改变的是

	elem.appendChild(svg.node())
}
