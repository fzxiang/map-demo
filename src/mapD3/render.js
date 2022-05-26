import * as d3 from 'd3'

export default function (elem, geoJson) {
	/**
	 * 基本配置
	 */

	const svg = d3.create('svg')
	const svgWidth = elem.offsetWidth;
	const svgHeight = elem.offsetHeight;
	const padding = 30;
	svg.attr("height", svgHeight)
	svg.attr("width", svgWidth);

	const mapContainer = svg.append("g")

	/**
	 * 获取投影，并配置
	 */
	const x0 = padding;
	const y0 = padding;
	const x1 = svgWidth - padding * 2;
	const y1 = svgHeight - padding * 2;
	const projection = d3.geoMercator().fitExtent(
		[
			[x0, y0], //左上角坐标
			[x1, y1], //右下角坐标
		], geoJson);

	/**
	 * 获取geographic path generator，并配置
	 */
	const pathGenerator = d3.geoPath().projection(projection);

	/**
	 * 利用pathGenerator与features生成path路径，绘制地图
	 */
	const mapPath = mapContainer.selectAll("path")
		.data(geoJson.features) //数据绑定
		.join("path")
		.attr("d", pathGenerator) //绘制path
		.attr("stroke-width", 0.5)
		.attr("stroke", "#000000")
		.attr("fill", "#444")
		.attr("cursor", "pointer"); //添加mapContainer装载地图绘制内容


	function zoomed() {
		const t = d3.event.transform;
		mapContainer.attr("transform", `translate(${t.x}, ${t.y}) scale(${t.k})`); //改变mapContainer的位置及缩放
	}
	const zoom = d3.zoom()
		.scaleExtent([1, 3])  //设置监听范围
		.on("zoom", zoomed);  //设置监听事件

	svg.call(zoom); //仍然应用于svg上，但是事件触发时改变的是

	elem.appendChild(svg.node())
}
