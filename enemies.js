class Enemy extends Entity{
	s = 1;
	mass = 1;
    color = "#f55";
    constructor() {
		super();
		// this.s = ceil(random() * 3)/2;
		// this.mass = this.s;
		var {velocity} = this;
		this.textures = [
			new Texture()
				.use(this)
					.for("x", "y")
					.as({
                        s: ["w", "h"],
                        color: "fill"
                    })
				.set("shape", shapes.get("square"))
				.link("blur", () => ({color: this.color, rad: this.s}))
				.link("r", () => atan2(velocity.y, velocity.x))
        ];
		var hex = floor(0xfff * random()).toString(16);
		this.color = `#${"0".repeat(3 - hex.length)}${hex}`;
    }
	tick() {
		var {velocity} = this;
		if(dist(velocity.x, velocity.y) == 0) {
			r = 2 * random() * PI;
		}else{
			var {r} = this;
		}
		this.move(r);
	}
}