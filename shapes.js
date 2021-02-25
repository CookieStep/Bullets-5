class Path extends Path2D{
	constructor(path) {
		if(typeof path == "function") {
			super();
			path(this);
		}else super(path);
	}
}

var shapes = new Map;

shapes.set("square", new Path(ctx =>
	ctx.rect(0, 0, 1, 1)
));
shapes.set("circle", new Path(ctx => 
	ctx.arc(.5, .5, .5, 0, PI * 2)
));
shapes.set("circle-2", new Path(ctx => 
	ctx.arc(.5, .5, .5 * hitrad, 0, PI * 2)
));
shapes.set("square-2", new Path(ctx => {
	var r = 1/2;
	ctx.moveTo(r, 0);
	ctx.lineTo(1 - r, 0);
	ctx.quadraticCurveTo(1, 0, 1, 0 + r);
	ctx.lineTo(1, 1 - r);
	ctx.quadraticCurveTo(1, 1, 1 - r, 1);
	ctx.lineTo(r, 1);
	ctx.quadraticCurveTo(0, 1, 0, 1 - r);
	ctx.lineTo(0, r);
	ctx.quadraticCurveTo(0, 0, r, 0);
}));
shapes.set("square-2b", new Path(ctx => {
	var r = 1/2;
	var s = .07;
	ctx.moveTo(r - s, -s);
	ctx.lineTo(1 - r + s, -s);
	ctx.quadraticCurveTo(1 + s, -s, 1 + s, r - s);
	ctx.lineTo(1 + s, 1 + s - r);
	ctx.quadraticCurveTo(1 + s, 1 + s, 1 + s - r, 1 + s);
	ctx.lineTo(r - s, 1 + s);
	ctx.quadraticCurveTo(-s, 1 + s, -s, 1 + s - r);
	ctx.lineTo(-s, r - s);
	ctx.quadraticCurveTo(-s, -s, r - s, -s);
}));
shapes.set("square-3", new Path(ctx => {
	var r = 1/3;
	ctx.moveTo(r, 0);
	ctx.lineTo(1 - r, 0);
	ctx.quadraticCurveTo(1, 0, 1, 0 + r);
	ctx.lineTo(1, 1 - r);
	ctx.quadraticCurveTo(1, 1, 1 - r, 1);
	ctx.lineTo(r, 1);
	ctx.quadraticCurveTo(0, 1, 0, 1 - r);
	ctx.lineTo(0, r);
	ctx.quadraticCurveTo(0, 0, r, 0);
}));
shapes.set("triangle", new Path(ctx => {
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 1);
	ctx.lineTo(1,.5);
	ctx.closePath();
}));
shapes.set("triangle-3", new Path(ctx => {
	var r = 1/3;
	var o = .12;
	ctx.lineTo(o, 1 - r);
	ctx.quadraticCurveTo(o, 1.1, r+o, 1);
	ctx.lineTo(1-r/2+o, .5+r/2);
	ctx.quadraticCurveTo(1+o,.5, 1-r/2+o, .5-r/2);
	ctx.lineTo(r+o, 0);
	ctx.quadraticCurveTo(o, -.1, o, r);
	ctx.closePath();
}));

/**
 * @param {DrawAble} what
*/
function draw(what) {
	var {x, y, w, h, shape, fill, stroke, shadow} = what;
	ctx.save();
	ctx.setTransform(w, 0, 0, h, x, y);
	if(shadow) {
		var {blur, color, x, y} = shadow;
		ctx.shadowBlur = blur ?? 0;
		ctx.shadowColor = color ?? "#000";
		ctx.shadowOffsetX = x ?? 0;
		ctx.shadowOffsetY = y ?? 0;
	}
	if(fill) {
		ctx.fillStyle = fill;
		ctx.fill(shape);
	}
	if(stroke) {
		ctx.strokeStyle = stroke;
		ctx.stroke(shape);
	}
	ctx.resetTransform();
	ctx.restore();
}