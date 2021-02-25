class Enemy extends Entity{
	constructor() {
		super();
		this.closest = {wh: this, dis: Infinity};
	}
	update() {
		super.update();
		this.closest = {wh: this, dis: Infinity};
	}
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
	// hitwall(x, y) {
	// 	var {velocity} = this;
	// 	if(x) velocity.x = 0;
	// 	if(y) velocity.y = 0;
	// }
	tick() {
		let player = this.closest.wh;
		var dis = Entity.distance(this, player);
		if(dis < 10) {
			var rad = Entity.radianTo(player, this);
			var mult = 1 - dis ** 2/100;
			this.color = `hsl(0, ${mult * 100}%, 50%)`;
			this.move(rad, mult);
			
		}
	}
}