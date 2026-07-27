#!/usr/bin/env node

// @ts-check
/** @import * as AntByte from "../../antbyte-js/lib" AntByte */

import process from 'node:process';
import * as fs from 'fs';
import { randomInt } from "../../antbyte-js/lib.mjs"

/**
 * @typedef {{ antID: number, input: number, bit: number }} Mutation
 * @typedef { AntByte.World & { mutations?: Mutation[] } } MutWorld
*/

main();

function main() {
	const [_0, _1, path, cmd] = process.argv;
	if (!path || !cmd) {
		console.error("usage: mutate.mjs <PATH> <add|run|pop|show>");
		return;
	}
	const world = parseWorld(path);
	if (!world.mutations) world.mutations = [];

	let func = {
		"add": () => { addMutation(world) },
		"run": () => { runWorld(world) },
		"pop": () => { popMutation(world) },
		"show": () => { showMutations(world) },
	}[cmd];

	if (func) { 
		func();
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

/** @param {MutWorld} world */
function addMutation(world) {
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

/** @param {MutWorld} world */
function runWorld(world) {
	world.mutations?.forEach(({ antID, input, bit }) => {
		world.ants[antID].logic[input] ^= 1 << bit;
	})

	const { ants, cfg } = world;
	const mutWorld = { ants, cfg };
	console.log(JSON.stringify(mutWorld, null, 2));
}

/** @param {MutWorld} world */
function popMutation(world) { 
	const mut = world.mutations?.pop();

	if (mut) {
		console.error(`removed mutation:\n${JSON.stringify(mut)}`);
	}
}

/** @param {MutWorld} world */
function showMutations(world) {
	console.log(JSON.stringify(world.mutations, null, 2));
}
