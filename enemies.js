class Enemy extends Entity{
	constructor() {
		super();
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y", "r")
					.as({
						s: ["w", "h"],
						color: "fill"
					})
				.set("shape", shapes.get("square-2b"))
				.link("blur", () => ({color: this.color, rad: this.s}))
		];
		this.closest = {dis: Infinity};
	}
	color = "#0f0"
	update() {
		super.update();
		this.closest = {dis: Infinity};
	}
	setClosest(wh, dis) {
		if(this.closest.dis > dis) {
			this.closest = {wh, dis};
		}
	}
}
class Point{
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	s = 0;
	get mx() {return this.x}
	get my() {return this.y}
}
class Scared extends Enemy{
	constructor() {
		super();
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y", "r")
					.as({
						s: ["w", "h"],
						color: "fill"
					})
				.set("shape", shapes.get("square-2b"))
				.link("blur", () => ({color: this.color, rad: this.s}))
		];
	}
	color = "#777";
	tick() {
		let player = this.closest.wh;
		var b = innerHeight/scale;
		var r = innerWidth/scale
		var uw = abs(this.y);
		var bw = abs(b - this.y - this.s);
		var lw = abs(this.x);
		var rw = abs(r - this.x - this.s);

		var d = 2;

		uw *= d;
		bw *= d;
		lw *= d;
		rw *= d;

		if(player) var dis = Entity.distance(this, player);
		else dis = Infinity;
		if(uw < dis) {
			player = new Point(this.mx, 0);
			dis = uw;
		}
		if(bw < dis) {
			player = new Point(this.mx, b);
			dis = bw;
		}
		if(lw < dis) {
			player = new Point(0, this.my);
			dis = lw;
		}
		if(rw < dis) {
			player = new Point(r, this.my);
			dis = rw;
		}
		if(dis < 10) {
			var rad = Entity.radianTo(player, this);
			var a = 1.5;
			var mult = 1 - dis ** a/(10 ** a);
			this.move(rad, mult);
		}else{
			var mult = 0;
		}
		this.color = `hsl(180, 100%, ${75 - mult * 50}%)`;
	}
}
class Chaser extends Enemy{
	constructor() {
		super();
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y", "r")
					.as({
						s: ["w", "h"],
						color: "fill"
					})
				.set("shape", shapes.get("square-2b"))
				.link("blur", () => ({color: this.color, rad: this.s}))
		];
	}
	setClosest(wh, dis) {
		if(!(wh instanceof Chaser)) super.setClosest(wh, dis);
	}
	color = "#777";
	tick() {
		let player = this.closest.wh;
		if(!player) return;
		var dis = Entity.distance(this, player);
		if(dis < 10) {
			var rad = Entity.radianTo(this, player);
			var a = 1.5;
			var mult = 1 - dis ** a/(10 ** a);
			this.move(rad);
		}else{
			var mult = 0;
		}
		this.color = `hsl(0, ${mult * 100}%, 50%)`;
	}
}
class Runner extends Enemy{
	constructor() {
		super();
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y", "r")
					.as({
						s: ["w", "h"],
						color: "fill"
					})
				.set("shape", shapes.get("square-2b"))
				.link("blur", () => ({color: this.color, rad: this.s}))
		];
	}
	color = "#fff";
	tick() {
		var {velocity} = this;
		var rad = dist(velocity.x, velocity.y)?
			this.r: 2 * PI * random();
		this.move(rad);
	}
}