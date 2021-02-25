const resize = () => (
	asn(resize.obj, {
		width: innerWidth,
		height: innerHeight
	}),
	asn(can, resize.obj)
);
resize.obj = {};

addEventListener("keydown", key => {
	var {code} = key;
	keys.has(code)? keys.set(code, 3): keys.set(code, 1);
});
addEventListener("keyup", key => {
	var {code} = key;
	keys.delete(code);
});

async function start() {
	await loaded;
	resize();
	document.body.appendChild(can);

	player = new Player();
	enemies.push(player);
	var w = 10;

	for(let i = 0; i < w; i++) enemies.push(new Runner);
	for(let i = 0; i < w; i++) enemies.push(new Scared);
	for(let i = 0; i < w; i++) enemies.push(new Chaser);

	for(let i = 0; i < w; i++) enemies.push(new Enemy);

	// enemies.push(new Scared);
	update();
}

var showFrames;
async function update() {
	var {last: old} = update;
	if(old + frameMs > Date.now()) {
		requestAnimationFrame(update);
	return}
	update.last = Date.now();
	var time = update.last - old;
	{
		ctx.fillStyle = "#0007";
		ctx.fillRect(0, 0, innerWidth, innerHeight);
		let {length: len} = enemies;
		for(let i = 0; i < len; ) {
			/**@type {Enemy}*/
			let enemy = enemies[i];
			for(let j = ++i; j < len; j++) {
				let player = enemies[j];
				if(Entity.AABB(player, enemy) && Entity.isTouching(player, enemy)) {
					Entity.collideD(player, enemy);
					// player.alive = false;
					// enemy.alive = false;
				}
				let dis = Entity.distance(enemy, player);
				enemy.setClosest(player, dis);
				player.setClosest(enemy, dis);
			}
			if(enemy.alive) {
				enemy.update();
				enemy.draw();
			}
			// enemy.drawHitbox();
		}
		enemies = enemies.filter(enemy => enemy.alive);
		if(showFrames) {
			ctx.fillStyle = "#fff";
			var s = innerHeight/10;
			ctx.font = `${s}px Arial`;
			ctx.fillText(round(1000/time), 0, s);
		}
	}
	requestAnimationFrame(update);
}
update.last = 0;
addEventListener("resize", resize);
start();