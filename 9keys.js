#!/usr/bin/env node

async function main() {
	const world = JSON.parse(await read());
	const keys9 = world.cfg.custom.keys9 ?? "12345670";
	world.cfg.keys = keys9;
	const newWorld = JSON.stringify(world, null, 4);
	console.log(newWorld);
}

async function read() {
	process.stdin.setEncoding('utf8');

	let str = '';

	for await (const chunk of process.stdin) {
		str += chunk;
	}

	return str.trim();
}

main();
