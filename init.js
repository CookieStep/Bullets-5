var can = document.createElement("canvas"),
	ctx = can.getContext("2d");
const {
	assign: asn
} = Object;
const {
	random,
	floor,
	ceil,
	round,
	atan2,
	cos,
	sin,
	PI,
	sqrt,
	abs,
	sign
} = Math;

var loop = (value, max) => (value % max + max) % max;
var rotate = (value, range) => {
	if(value > +range/2) value -= range;
	if(value < -range/2) value += range;
	return value;
}
var rDis = (a, b, c=(PI * 2)) => rotate(loop(b - a, c), c);

const wait = time => new Promise(resolve => setTimeout(resolve, time));
const turn = () => new Promise(resolve => setTimeout(resolve));

const frameMs = 1000/120;
const loaded = new Promise(resolve => addEventListener("load", resolve));

var scale = 20;

const hitrad = 1/sin(PI/3);
const friction = sqrt(0.85);

const dist = (x, y) => sqrt(x ** 2 + y ** 2);

var player, enemies = [];

const keys = new Map;