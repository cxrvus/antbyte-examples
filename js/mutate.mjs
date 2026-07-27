#!/usr/bin/env node

// @ts-check
/** @import { World } from "../../antbyte-js/lib" AntByte */

import process from 'node:process';
import * as fs from 'fs';
import { randomInt } from "../../antbyte-js/lib.mjs"

/**
 * @typedef {{ antID: number, input: number, bit: number }} Mutation
 * @typedef { World & { mutations?: Mutation[] } } MutWorld
*/

main();

function main() {
	const [_0, _1, path, cmd, countStr] = process.argv;
	if (!path || !cmd) {
		console.error("usage: mutate.mjs <PATH> <PATH2>|add|pop|apply|view [count]");
		return;
	}

	const world = parseWorld(path);
	if (!world.mutations) world.mutations = [];

	const count = !countStr ? 1 : parseInt(countStr);

	if (count < 1 || count > 16) {
		console.error("count must be between 1 and 16");
		return;
	}

	let func = {
		"add": () => { addMutation(world, count) },
		"pop": () => { popMutation(world, count) },
		"apply": () => { applyMut(world) },
		"view": () => { viewMut(world) },
	}[cmd];

	if (func) { 
		func();
	} else if (fs.readFileSync(cmd, 'utf-8')) {
		const path2 = cmd;
		const world2 = parseWorld(path2);
		const crossed = crossWorlds(world, world2);
		const content = JSON.stringify(crossed, null, 2);
		console.log(content);
	} else {
		console.error("unknown mutation command: " + cmd);
		return;
	}

	if (["add", "pop"].includes(cmd)) {
		const content = JSON.stringify(world, null, 2);
		fs.writeFileSync(path, content);
	}
}

/**
 * @param {string} path
 */
function parseWorld(path) {
	const file = fs.readFileSync(path, 'utf-8');
	/** @type {MutWorld} */
	const world = JSON.parse(file);
	return world;
}

/**
 * @param {MutWorld} world
 * @param {number} count
 */
function addMutation(world, count) {
	for (let i = 0; i < count; i++) {
		const antIDs = Object.keys(world.ants);
		const antID = parseInt(antIDs[randomInt(antIDs.length)]);
		const targetAnt = world.ants[antID];
		const inputCount = 1 << targetAnt.inputs.length;
		const outputCount = targetAnt.outputs.length;

		const input = randomInt(inputCount);
		const bit = randomInt(outputCount);

		const mutation = { antID, input, bit };
		world.mutations?.push(mutation)

		console.error(`added mutation:\n${JSON.stringify(mutation)}`);
	}
}

/** @param {MutWorld} world */
function applyMut(world) {
	world.mutations?.forEach(({ antID, input, bit }) => {
		world.ants[antID].logic[input] ^= 1 << bit;
	})

	const { ants, cfg } = world;
	const mutWorld = { ants, cfg };
	console.log(JSON.stringify(mutWorld, null, 2));
}

/**
 * @param {MutWorld} world
 * @param {number} count
 */
function popMutation(world, count) { 
	for (let i = 0; i < count; i++) {
		const mut = world.mutations?.pop();

		if (mut) {
			console.error(`removed mutation:\n${JSON.stringify(mut)}`);
		}
	}
}

/** @param {MutWorld} world */
function viewMut(world) {
	console.log(JSON.stringify(world.mutations, null, 2));
}

/**
 * @param {MutWorld} world1
 * @param {MutWorld} world2
 * @returns {World}
 */
function crossWorlds(world1, world2) {
	const cfg = crossObjects(world1.cfg, world2.cfg);
	const ants = crossObjects(world1.ants, world2.ants);
	return { ants, cfg }
}

/**
 * @param {Object} obj1
 * @param {Object} obj2
 */
function crossObjects(obj1, obj2) {
	const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])];

	const resolutionEntries = keys
		// @ts-ignore
		.map(key => [obj1[key], obj2[key], key])
		.filter(([val1, val2, _key]) => val1 && val2)
		.map(([val1, val2, key]) => {
			const coin_flip = randomInt(2);
			const val = [val1, val2][coin_flip];
			console.error(`taking ${key} from world ${coin_flip + 1}`);
			return [key, val]
		})
	;

	const resolution = Object.fromEntries(resolutionEntries);
	
	return { ...obj1, ...obj2, ...resolution };
}
