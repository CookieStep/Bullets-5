class Player extends Entity{
	mass = 1;
	s = 1;
	constructor() {
		super();
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y", "r")
					.as({s: ["w", "h"]})
				.set("fill", "#aaf")
				.set("shape", shapes.get("square-2"))
				.set("blur", {color: "#aaf", rad: this.s})
		];
	}
	forces() {
		var {velocity} = this;
		this.x += velocity.x;
		this.y += velocity.y;
		if(!keys.has("ShiftLeft")) {
			velocity.x *= friction;
			velocity.y *= friction;
		}
	}
	tick() {
		var move = {x: 0, y: 0};
		if(keys.has("KeyD")) ++move.x;
		if(keys.has("KeyS")) ++move.y;
		if(keys.has("KeyA")) --move.x;
		if(keys.has("KeyW")) --move.y;
		if(move.x || move.y) {
			var rad = atan2(move.y, move.x);
			var params = [rad];
			if(keys.has("ShiftRight")) params.push(0.2);
			this.move(...params);
		}
	}
}