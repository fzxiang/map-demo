import { SVG } from "leaflet";
import { getURL } from "../utils";

export default () => {
	SVG.include({
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
				this._defs = SVG.create('defs');
				this._container.appendChild(this._defs);
			}
			const _img_url = options.fill.substring(4, options.fill.length - 1);
			const _ref_id = _img_url.match(/(\d+)/)[1];
			const [w, h] = layer.feature.properties.shape

			let _p = document.getElementById(_ref_id);
			const zoom = this._zoom

			if (!_p) {
				const _im = new Image();
				_im.src = getURL(_img_url);

				_p = SVG.create('pattern');
				_p.setAttribute('id', _ref_id);
				_p.setAttribute('x', 0);
				_p.setAttribute('y', 0);
				_p.setAttribute('patternUnits', 'objectBoundingBox');
				_p.setAttribute('width', 1);
				_p.setAttribute('height', 1);

				this._defs.appendChild(_p);

				// const
				const _img = SVG.create('image');
				_img.setAttribute('x', '0');
				_img.setAttribute('y', '0');
				_img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', getURL(_img_url));
				_img.setAttribute('width',  2**zoom*w);
				_img.setAttribute('height', 2**zoom*h);
				_img.setAttribute('w', w);
				_img.setAttribute('h', h);
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
}

