// @ts-check

import { ant, run } from "../../antbyte-js/lib.mjs"

run({
	cfg: {
		description: "Langton's Ant",
		width: 64,
		height: 64,
		speed: 64,
		border: { 0: "die" },
		start_pos: "center",
		bg_filter: "bin",
	},
	ants: {
		1: ant("main", (COL_2) => ({
			CLR: true,
			COL_2: !COL_2,
			ROT_1: true,
			ROT_0: COL_2,
		})),
	},
})
