// canvas操作类
export function CanvasOperation(option) {
	if (!option.ele || !option.draw) return;
	this.ele = option.ele; // 画布对象
	this.userDraw = option.draw; // 用户绘图方法
	this.width = option.width || 500; // 画布宽
	this.height = option.height || 500; // 画布高
	this.cssWidth = option.cssWidth || this.width; // css设置的宽
	this.cssHeight = option.cssHeight || this.height; // css设置的高
	this.maxScale = option.maxScale || 8; // 缩放最大倍数（缩放比率倍数）
	this.minScale = option.minScale || 0.4; // 缩放最小倍数（缩放比率倍数）
	this.scaleStep = option.scaleStep || 0.2; // 缩放比率
	this.ctx = this.ele.getContext("2d");
	console.log(this.ctx)
	var _this = this;
	var scale = 1; // 当前缩放
	var preScale = 1;
	var offset = { x: 0, y: 0 }; // 拖动偏移
	var curOffset = { x: 0, y: 0 }; // 当前偏移
	var mousePos = { x: 0, y: 0 }; // 鼠标位置
	var widthRatio = this.width / this.cssWidth; // 画布和css宽比率
	var heightRatio = this.height / this.cssHeight; //  画布和css高比率
	console.log(widthRatio);
	console.log(heightRatio);

	// 判断是否移动端，移动端使用触摸事件
	var isTouchPad = /hp-tablet/gi.test(navigator.appVersion);
	var hasTouch = "ontouchstart" in window && !isTouchPad;
	var touchStart = hasTouch ? "touchstart" : "mousedown";
	var touchMove = hasTouch ? "touchmove" : "mousemove";
	var touchEnd = hasTouch ? "touchend" : "mouseup";

	// 绘图（会进行缩放和位移）
	this.draw = function () {
		this.clearCanvas();
		this.ctx.translate(offset.x, offset.y);
		this.ctx.scale(scale, scale);
		_this.userDraw();
	};

	// 放大
	this.zoomIn = function (isMouse) {
		scale += this.scaleStep;
		if (scale > this.maxScale) {
			scale = this.maxScale;
			return;
		}
		zoom.call(this, isMouse);
	};

	// 缩小
	this.zoomOut = function (isMouse) {
		scale -= this.scaleStep;
		if (scale < this.minScale) {
			scale = this.minScale;
			return;
		}
		zoom.call(this, isMouse);
	};

	/**
	 * 缩放操作
	 * isMouse 是否鼠标为中心缩放，true:鼠标中心缩放 false:画布中间缩放
	 */
	function zoom(isMouse) {
		// 是否居中放大
		if (isMouse) {
			mousePos.x *= widthRatio;
			mousePos.y *= heightRatio;
		} else {
			mousePos.x = this.width / 2;
			mousePos.y = this.height / 2;
		}

		offset.x = mousePos.x - ((mousePos.x - offset.x) * scale) / preScale;
		offset.y = mousePos.y - ((mousePos.y - offset.y) * scale) / preScale;
		this.draw();
		preScale = scale;
		curOffset.x = offset.x;
		curOffset.y = offset.y;
	};

	// 还原
	this.reset = function () {
		this.clear();
		this.draw();
	};

	// 仅清除地图
	this.clearCanvas = function () {
		// 重设canvas尺寸会清空地图并重置canvas内置的scale等
		this.ele.width = this.width;
	};

	// 清除地图并还原对象所有设置
	this.clear = function () {
		this.clearCanvas()
		scale = 1; // 当前缩放
		preScale = 1; // 当前缩放
		offset = { x: 0, y: 0 }; // 拖动偏移
		curOffset = { x: 0, y: 0 }; // 当前偏移
		mousePos = { x: 0, y: 0 }; //
	};

	//  添加滚轮事件
	this.addMusewheelEvent = function () {
		// 兼容FireFox
		const eventType = document.mozFullScreen
			? "DOMMouseScroll"
			: "mousewheel";
		this.ele.addEventListener(eventType, mouseWheel);

		function mouseWheel(e) {
			mousePos.x = e.offsetX;
			mousePos.y = e.offsetY;
			var b = true;
			if (e.wheelDelta) {
				b = e.wheelDelta > 0;
			} else {
				b = e.detail < 0;
			}
			if (b) {
				_this.zoomIn(true);
			} else {
				_this.zoomOut(true);
			}
			if (e.preventDefault) {
				e.preventDefault();
			}
			return false;
		}
	};

	// 添加拖动事件
	this.addDragEvent = function () {
		this.ele.addEventListener(touchStart, dragStart);
		let x = 0;
		let y = 0;

		function dragMove(e) {
			offset.x = curOffset.x + (e.x - x) * widthRatio;
			offset.y = curOffset.y + (e.y - y) * heightRatio;
			_this.draw();
		}

		function dragEnd() {
			curOffset.x = offset.x;
			curOffset.y = offset.y;
			window.removeEventListener(touchMove, dragMove);
			window.removeEventListener(touchEnd, dragEnd);
		}

		function dragStart(e) {
			x = e.x;
			y = e.y;
			window.addEventListener(touchMove, dragMove);
			window.addEventListener(touchEnd, dragEnd);
		}
	};
}
