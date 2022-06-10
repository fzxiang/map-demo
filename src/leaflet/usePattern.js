import * as L from "leaflet";

L.SVG.include({
	_updateStyle: function (layer) {
		const path = layer._path
		const	options = layer.options

		if (!path) { return; }

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);
			path.setAttribute('stroke-linecap', options.lineCap);
			path.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				path.setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				path.removeAttribute('stroke-dashoffset');
			}
		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			if (typeof(options.fill) == "string" &&
				options.fill.match(/^url\(/)) {
				// here what we add
				this.__fillPattern(layer);
			}
			else {
				path.setAttribute('fill', options.fillColor || options.color);
			}
			path.setAttribute('fill-opacity', options.fillOpacity);
			path.setAttribute('fill-rule', options.fillRule || 'evenodd');
		} else {
			path.setAttribute('fill', 'none');
		}
	},

	__fillPattern: function(layer) {
		const path = layer._path
		const options = layer.options
		if (!this._defs) {
			this._defs = L.SVG.create('defs');
			this._container.appendChild(this._defs);
		}
		const _img_url = options.fill.substring(4, options.fill.length - 1);
		const _ref_id = _img_url.match(/(\d+)/)[1];
		let multiple = 1
		if (_ref_id === 0 || _ref_id > 4000) {
			multiple = 3
		}
		let _p = document.getElementById(_ref_id);
		const zoom = this._zoom
		const rect = 2**zoom * multiple

		if (!_p) {
			const _im = new Image();
			_im.src = _img_url;

			_p = L.SVG.create('pattern');
			_p.setAttribute('id', _ref_id);
			_p.setAttribute('x', 0);
			_p.setAttribute('y', 0);
			_p.setAttribute('patternUnits', 'objectBoundingBox');
			_p.setAttribute('width', 1);
			_p.setAttribute('height', 1);

			this._defs.appendChild(_p);

			// const
			const _img = L.SVG.create('image');
			_img.setAttribute('x', '0');
			_img.setAttribute('y', '0');
			_img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', _img_url);
			_img.setAttribute('width', rect);
			_img.setAttribute('height', rect);
			_p.appendChild(_img);

			_im.onload = function() {
				// _p.setAttribute('width', _im.width);
				// _p.setAttribute('height', _im.height);
				// _img.setAttribute('width', _im.width);
				// _img.setAttribute('height', _im.height);
			};
		}
		path.setAttribute('fill', "url(#"+_ref_id+")");
	}
});

