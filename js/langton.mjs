// @ts-check

import { ant, run } from "../../antbyte-js/lib.mjs"

run({
	cfg: {
		description: "Langton's Ant",
		width: 64,
		height: 64,
		speed: 64,
		border: { 0: "despawn" },
		start_pos: "center",
		bg_filter: "bin",
	},
	ants: {
		1: ant("main", (C2) => ({
			CZ: true,
			C2: !C2,
			R1: true,
			R0: C2,
		})),
	},
})
