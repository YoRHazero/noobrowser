import type { Frame, LayerModel } from "@/canvas/imageCanvas";

const PLACEHOLDER_BASE_WIDTH = 192;
const PLACEHOLDER_BASE_HEIGHT = 128;

function createScalarFrame(id: string, width: number, height: number): Frame {
	const array = new Float32Array(width * height);
	for (let y = 0; y < height; y += 1) {
		for (let x = 0; x < width; x += 1) {
			const gradient = x / Math.max(1, width - 1);
			const ridge = Math.exp(-((y - height * 0.52) ** 2) / (height * 7));
			const ripple = Math.sin(x * 0.12) * Math.cos(y * 0.16) * 0.08;
			array[y * width + x] = Math.max(0, gradient * 0.72 + ridge + ripple);
		}
	}

	return {
		id,
		x: 0,
		y: 0,
		width,
		height,
		data: {
			kind: "scalar",
			array,
			dataType: "float32",
		},
	};
}

const PLACEHOLDER_BASE_FRAME = createScalarFrame(
	"placeholder-base",
	PLACEHOLDER_BASE_WIDTH,
	PLACEHOLDER_BASE_HEIGHT,
);

export const IMAGE_INSPECTOR_PLACEHOLDER_BASE_LAYER: LayerModel = {
	frames: [PLACEHOLDER_BASE_FRAME],
	activeId: PLACEHOLDER_BASE_FRAME.id,
};
