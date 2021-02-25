class Entity{
	constructor() {
		this.x = random() * innerWidth/scale;
		this.y = random() * innerHeight/scale;
	}
	alive = true;
	x = 0;
	y = 0;
	spd = .025;
	get mx() {return this.x + this.s/2}
	get my() {return this.y + this.s/2}
	set mx(va) {this.x = va - this.s/2}
	set my(va) {this.y = va - this.s/2}
	velocity = {x: 0, y: 0};
	get r() {
		var {velocity} = this;
		return atan2(velocity.y, velocity.x);
	}
	get hitrad() {return this.s * hitrad/2}
	mass = 1;
	bounce = 1;
	s = 1;
	textures = [];
	draw() {
		this.textures.forEach(texture => texture.draw());
	}
	update() {
		this.tick();
		this.forces();
		this.screenlock();
	}
	tick() {}
	forces() {
		var {velocity} = this;
		this.x += velocity.x;
		this.y += velocity.y;
		velocity.x *= friction;
		velocity.y *= friction;
	}
	screenlock() {
		var hitwall = [];
		if(this.x < 0) {
			this.x = 0;
			hitwall.push(true);
		}else if(this.x + this.s > innerWidth/scale) {
			this.x = innerWidth/scale - this.s;
			hitwall.push(true);
		}else{
			hitwall.push(false);
		}
		if(this.y < 0) {
			this.y = 0;
			hitwall.push(true);
		}else if(this.y + this.s > innerHeight/scale) {
			this.y = innerHeight/scale - this.s;
			hitwall.push(true);
		}else{
			hitwall.push(false);
		}
		this.hitwall(...hitwall);
		if(hitwall[0] || hitwall[1]) this.hitwallResolve?.(hitwall);
		else this.hitwallReject?.();
		delete this.hitwallResolve;
		delete this.hitwallReject;
	}
	hitwall(x, y) {
		var {velocity} = this;
		if(x) velocity.x *= -1;
		if(y) velocity.y *= -1;
	}
	/**@returns {Promise<[boolean, boolean]>}*/
	onHitwall() {
		return new Promise((resolve, reject) => {
			this.hitwallResolve = resolve;
			this.hitwallReject = reject;
		});
	}

	move(rad, mult=1) {
		var {spd} = this;
		var {velocity} = this;
		spd *= mult;
		// spd /= this.mass;

		velocity.x += cos(rad) * spd;
		velocity.y += sin(rad) * spd;
	}
	drawHitbox() {
		var x = this.mx,
			y = this.my;
		var s = this.s * scale;
		x *= scale; y *= scale;
		ctx.beginPath();
		ctx.arc(x, y, s * hitrad/2, 0, PI * 2);
		ctx.strokeStyle = "red";
		ctx.stroke();
	}
	static AABB(a, b) {
		var s = a.s + b.s;
		var ax = a.x;
		var bx = b.x;
		var ay = a.y;
		var by = b.y;
		return ax + s > bx
			&& bx + s > ax
			&& ay + s > by
			&& by + s > ay
		;
	}
	static isTouching = (a, b) => dist(a.mx - b.mx, a.my - b.my) <= (a.s + b.s) * hitrad/2;
	static radianTo = (a, b) => atan2(b.my - a.my, b.mx - a.mx);
	static distance = (a, b) => dist (a.mx - b.mx, a.my - b.my);
	// /**
	//  * @param {Entity} a
	//  * @param {Entity} b
	// */
	// static collideOri(a, b) {
	// 	var ao = (a.mass - b.mass);
	// 	var ab = (a.mass + b.mass);
	// 	var bm = 1 * b.mass;
	// 	var am = 1 * a.mass;
	// 	var {velocity: bv} = b;
	// 	var {velocity: av} = a;
	// 	var avx = (av.x *  ao + (bm * bv.x)) / ab;
	// 	var avy = (av.y *  ao + (bm * bv.y)) / ab;
	// 	var bvx = (bv.x * -ao + (am * av.x)) / ab;
	// 	var bvy = (bv.y * -ao + (am * av.y)) / ab;

	// 	a.velocity = {
	// 		x: avx,
	// 		y: avy
	// 	};
	// 	b.velocity = {
	// 		x: bvx,
	// 		y: bvy
	// 	};

	// 	a.x += avx;
	// 	a.y += avy;
	// 	b.x += bvx;
	// 	b.y += bvy;
	// }
	// /**
	//  * @param {Entity} a
	//  * @param {Entity} b
	// */
	// static collideB(a, b) {
	// 	var s = (a.s + b.s)/2;
	// 	var {velocity: bv} = b;
	// 	var {velocity: av} = a;
	// 	var na = {
	// 		x: a.mx,
	// 		y: a.my
	// 	}
	// 	var oa = {
	// 		x: na.x - av.x,
	// 		y: na.y - av.y
	// 	}
	// 	var nb = {
	// 		x: b.mx,
	// 		y: b.my
	// 	}
	// 	var ob = {
	// 		x: nb.x - bv.x,
	// 		y: nb.y - bv.y
	// 	}
	// 	var AL = new Line(na, oa);
	// 	var BL = new Line(nb, ob);
	// 	var TP = Line.touchPoint(AL, BL);
	// 	if(isNaN(TP.x) || isNaN(TP.y)) return;
	// 	//Distance until complete overlap
	// 	var d = dist(oa.x - TP.x, oa.y - TP.y);
	// 	//Original distance
	// 	var os = dist(oa.x - ob.x, oa.y - ob.y);
	// 	//Unit
	// 	var u = d/os;
	// 	//os - u * amo = s
	// 	//amo * -u = s - os
	// 	//amo = (os - s)/u
	// 	//amount to go along the line
	// 	var amo = (os - s)/u;
		
	// }
	// /**
	//  * @param {Entity} a
	//  * @param {Entity} b
	// */
	// static collideC(b, a) {
	// 	var {velocity: bv, mass: bm} = b;
	// 	var {velocity: av, mass: am} = a;
	// 	var hrad = this.radianTo(a, b);
		
	// 	//Center point
	// 	var px = a.mx + a.hitrad * cos(hrad);
	// 	var py = a.my + a.hitrad * sin(hrad);

	// 	a.mx = px - cos(hrad) * a.hitrad;
	// 	a.my = py - sin(hrad) * a.hitrad;
	// 	b.mx = px + cos(hrad) * b.hitrad;
	// 	b.my = py + sin(hrad) * b.hitrad;

	// 	//Line radian
	// 	var lrad = rDis(PI, hrad);

	// 	//Movement radian
	// 	var amr = rDis(lrad, a.r);
	// 	var bmr = rDis(lrad, b.r);

	// 	//Movement force
	// 	var amf = cos(amr);
	// 	var bmf = cos(bmr);

	// 	if(sign(amf) > 0) amf = 0;
	// 	if(sign(bmf) < 0) bmf = 0;

	// 	//Velocity force
	// 	var avf = dist(av.x, av.y);
	// 	var bvf = dist(bv.x, bv.y);

	// 	var aforce = amf * avf;
	// 	var bforce = bmf * bvf;

	// 	b.velocity.x = cos(hrad) * -aforce;
	// 	b.velocity.y = sin(hrad) * -aforce;

	// 	a.velocity.x = cos(hrad) * -bforce;
	// 	a.velocity.y = sin(hrad) * -bforce;
	// }
	/**
	 * @param {Entity} a
	 * @param {Entity} b
	*/
	static collideD(b, a) {
		var {velocity: bv, mass: bm} = b;
		var {velocity: av, mass: am} = a;

		am = sqrt(am);
		bm = sqrt(bm);

		var hrad = this.radianTo(a, b);
		
		//Center point
		var px = a.mx + a.hitrad * cos(hrad);
		var py = a.my + a.hitrad * sin(hrad);

		a.mx = px - cos(hrad) * a.hitrad;
		a.my = py - sin(hrad) * a.hitrad;
		b.mx = px + cos(hrad) * b.hitrad;
		b.my = py + sin(hrad) * b.hitrad;

		//Line radian
		var lrad = rDis(PI, hrad);

		//Movement radian
		var amr = rDis(lrad, a.r);
		var bmr = rDis(lrad, b.r);

		//Movement force
		var amf = cos(amr);
		var bmf = cos(bmr);

		if(sign(amf) > 0) amf = 0;
		if(sign(bmf) < 0) bmf = 0;

		//Movement saved
		var ams = abs(sin(amr));
		var bms = abs(sin(bmr));

		//Velocity force
		var avf = dist(av.x, av.y);
		var bvf = dist(bv.x, bv.y);

		var aforce = amf * avf;
		var bforce = bmf * bvf;

		var ab = am/bm;
		var ba = bm/am;

		var tm = am + bm;
		var abm = am/tm;
		var bam = bm/tm;

		bms = bms + (1 - bms) * (bam - 1);
		ams = ams + (1 - ams) * (abm - 1);

		b.velocity.x = b.velocity.x * bms - cos(hrad) * aforce * ab;
		b.velocity.y = b.velocity.y * bms - sin(hrad) * aforce * ab;
		a.velocity.x = a.velocity.x * ams - cos(hrad) * bforce * ba;
		a.velocity.y = a.velocity.y * ams - sin(hrad) * bforce * ba;
	}
	/**
	 * @param {Entity} a
	 * @param {({m: number, b: number} | {x: number})} l
	*/
	static touchLine(a, l) {
		if("x" in l) {
			var {x} = l;
			if(x > a.x && x < a.x + a.s)
				return true;
			return false;
		}else{
			var {m, b} = l;
			var {mx: k, my: h, s} = a;

			var qa = (m ** 2 + 1);
			var qb = 2 * b * m - 2 * h * m - 2 * k;
			var qc = b ** 2 - 2 * b * h + h ** 2 + k ** 2 - (s / 2) ** 2;

			var q = (-qb + sqrt(qb ** 2 - 4 * qa * qc)) / (2 * qa);

			return !isNaN(q);
		}
	}
}
// class Line{
// 	constructor(from, to) {
// 		var m = (from.y - to.y)/(from.x - to.x);
// 		//y = mx + b
// 		//b = y - mx
// 		var b = from.y - m * from.x;
// 		if(abs(m) == Infinity) {
// 			var x = from.x;
// 			this.x = x;
// 		}
// 		this.b = b;
// 		this.m = m;
// 	}
// 	solve(x) {
// 		return this.m * x + this.b;
// 	}
// 	static touchPoint(line, line2) {
// 		var {m, b} = line;
// 		var {m: m2, b: b2} = line2;
// 		if(line.x || line2.x) {
// 			if(line.x && line2.x && line.x != line2.x) {
// 				return {x: undefined, y: undefined};
// 			}else{
// 				var x = line.x ?? line2.x;
// 			}
// 		}else{
// 			//mx + b = m2x + b2
// 			//mx - m2x = b2 - b
// 			//x(m - m2) = b2 - b
// 			//x = (b2 - b)/(m - m2)
// 			var x = (b2 - b)/(m - m2);
// 		}
// 		var y = line.solve(x);
// 		if(isNaN(y)) y = line2.solve(x);
// 		return {x, y};
// 	}
// }