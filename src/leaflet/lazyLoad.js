import * as L from "leaflet";
import useData from './useData'
const [dataRef, setData] = useData()

const Class = L.GeoJSON.extend({
	options: {
		debug: false,
		usebbox: false,
		pollTime:0,
		once: false,
		disabled: false,
	},
	callback: function (data) {
		this.clearLayers();//if needed, we clean the layers

		//Then we add the new data
		this.addData(data);
	},
	initialize: function (uOptions, options) {
		L.GeoJSON.prototype.initialize.call(this, undefined, options);
		L.Util.setOptions(this, uOptions);

		this._layersOld = [];
		this._requests = [];
	},
	onMoveEnd: async function (e) {
		if (this.options.disabled) {
			return;
		}
		if (this.options.debug) {
			console.log('load Data');
		}

		const self = this;
		const bounds = self._map.getBounds();
		const boxString = bounds.toBBoxString()
		const zoom =  self._map.getZoom();
		const { lat, lng } = bounds.getCenter()
		await setData({
			lat,
			lng,
			zoom,
			boxString,
		})

		let data = dataRef.value
		self.callback(data);

	},
	onAdd: function (map) {
		this._map = map;
		this.onMoveEnd();

		if (!this.options.once) {
			map.on('dragend', this.onMoveEnd, this);
			map.on('zoomend', this.onMoveEnd, this);
			map.on('refresh', this.onMoveEnd, this);

			if (this.options.pollTime > 0) {
				this.intervalID = window.setInterval(this.onMoveEnd.bind(this), this.options.pollTime);
			}
		}

		if (this.options.debug) {
			console.log('add Layer')
		}
	},

	onRemove: function (map) {

		if (this.options.debug) {
			console.log('remove layer');
		}
		L.LayerGroup.prototype.onRemove.call(this, map);

		if (!this.options.once && this.options.pollTime > 0) {
			window.clearInterval(this.intervalID);
		}

		while(this._requests.length > 0) {
			this._requests.shift().abort();
		}

		if(!this.options.once) {
			map.off({
				'dragend': this.onMoveEnd
			}, this);
			map.off({
				'zoomend': this.onMoveEnd
			}, this);
			map.off({
				'refresh': this.onMoveEnd
			}, this);
		}

		this._map = null;
	},

});

export default function (uOptions, options) {
	return new Class(uOptions, options);
};
