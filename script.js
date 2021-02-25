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
	for(let i = 0; i < 500; i++) enemies.push(new Scared);

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
		player.alive && player.update();
		let {length: len} = enemies;
		for(let i = 0; i < len; ) {
			/**@type {Enemy}*/
			let enemy = enemies[i];
			let dis = Entity.distance(enemy, player);
			if(enemy.closest.dis > dis) {
				enemy.closest = {wh: player, dis};
			}
			if(player.alive && Entity.AABB(player, enemy) && Entity.isTouching(player, enemy)) {
				Entity.collideD(player, enemy);
				// player.alive = false;
			}
			for(let j = ++i; j < len; j++) {
				let player = enemies[j];
				let dis = Entity.distance(enemy, player);
				if(enemy.closest.dis > dis) {
					enemy.closest = {wh: player, dis};
				}
				if(player.closest.dis > dis) {
					player.closest = {wh: enemy, dis};
				}
				if(Entity.AABB(player, enemy) && Entity.isTouching(player, enemy)) {
					Entity.collideD(player, enemy);
				}
			}
			enemy.update();
			enemy.draw();
			// enemy.drawHitbox();
		}
		player.alive && (player.draw());
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