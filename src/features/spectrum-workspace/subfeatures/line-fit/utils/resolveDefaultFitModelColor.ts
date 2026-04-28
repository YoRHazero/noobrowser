const FIT_MODEL_COLORS = [
	"#0ea5e9",
	"#f97316",
	"#22c55e",
	"#e11d48",
	"#8b5cf6",
	"#14b8a6",
	"#f59e0b",
	"#ec4899",
	"#64748b",
];

function hashString(value: string): number {
	let hash = 0;
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
	}

	return hash;
}

export function resolveDefaultFitModelColor(seed: string): string {
	return FIT_MODEL_COLORS[hashString(seed) % FIT_MODEL_COLORS.length];
}
