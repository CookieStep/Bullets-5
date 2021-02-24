class Texture{
	constructor() {
		this.values = new Proxy({}, {
			get: (_, prop) => {
				return this.data[prop]?.value;
			},
			set: (_, prop, value) => {
				this.set(prop, value);
			}
		});
	}
	link(prop, func) {
		this.data[prop] = {get value() {return func()}}
		return this;
	}
	use(obj) {
		this.ref = obj;
		return this;
	}
	for(...params) {
		var obj = this.ref;
		params.forEach(prop => {
			if(typeof prop == "string") {
				this.data[prop] = {get value() {return obj[prop]}};
			}else{
				this.data[prop[1]] = {get value() {
					return obj[prop[0]];
				}}
			}
		});
		return this;
	}
	as(pobj) {
		var obj = this.ref;
		var keys = Object.keys(pobj);
		keys.forEach(link => {
			var as = pobj[link];
			if(typeof as == "string") {
				this.data[as] = {get value() {return obj[link]}};
			}else{
				as.forEach(prop => 
					this.data[prop] = {get value() {return obj[link]}}
				);
			}
		});
		return this;
	}
	set(prop, value) {
		this.data[prop] = {
			value
		};
		return this;
	}
	get(prop) {
		return this.data[prop]?.value;
	}
	draw() {
		var {x, y, w, h, r=0, fill, stroke, blur, shape} = this.values;
		x *= scale;
		y *= scale;
		w *= scale;
		h *= scale;
		ctx.setTransform(w, 0, 0, h, x, y);
		ctx.save();
		ctx.translate(1/2, 1/2);
		ctx.rotate(r);
		ctx.translate(-1/2, -1/2);
		// if(blur) {
		// 	ctx.shadowBlur = blur.rad * scale;
		// 	ctx.shadowColor = blur.color;
		// }
		if(fill) {
			ctx.fillStyle = fill;
			ctx.fill(shape);
		}
		if(stroke) {
			ctx.lineWidth = 1/100;
			ctx.strokeStyle = stroke;
			ctx.stroke(shape);
		}
		ctx.restore();
		ctx.resetTransform();
	}
	data = {};
}