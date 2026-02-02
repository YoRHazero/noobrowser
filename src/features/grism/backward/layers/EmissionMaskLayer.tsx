import "@/components/three/EmissionMaskMaterial";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { Color, DataTexture, DoubleSide } from "three";
import { useEmissionMaskLayer } from "./hooks/useEmissionMaskLayer";

export const EMISSION_MASK_COLORS = [
	"#e6194b",
	"#3cb44b",
	"#ffe119",
	"#4363d8",
	"#f58231",
	"#911eb4",
	"#46f0f0",
	"#f032e6",
	"#bcf60c",
	"#fabebe",
	"#008080",
	"#e6beff",
	"#9a6324",
	"#fffac8",
	"#800000",
	"#aaffc3",
	"#808000",
	"#ffd8b1",
	"#000075",
	"#808080",
];



/**
 * Generate circle points for rendering
 */
function generateCirclePoints(
	centerX: number,
	centerY: number,
	radius: number,
	segments = 32,
	z = 0.15,
): [number, number, number][] {
	const points: [number, number, number][] = [];
	for (let i = 0; i <= segments; i++) {
		const angle = (i / segments) * Math.PI * 2;
		points.push([
			centerX + Math.cos(angle) * radius,
			centerY + Math.sin(angle) * radius,
			z, // z position above heatmap
		]);
	}
	return points;
}

const CIRCLE_RADIUS = 24;
const CIRCLE_LINE_WIDTH = 4;

export default function EmissionMaskLayer({
	meshZ = 0.1,
	circleZ = 0.15,
}: {
	meshZ?: number;
	circleZ?: number;
} = {}) {
	const {
		isVisible,
		texture,
		threshold,
		maxValue,
		xStart,
		yStart,
		width,
		height,
		regions,
	} = useEmissionMaskLayer();

	// Create shared palette texture
	const paletteTexture = useMemo(() => {
		const width = EMISSION_MASK_COLORS.length;
		const height = 1;
		const size = width * height;
		const data = new Uint8Array(4 * size);

		EMISSION_MASK_COLORS.forEach((hex, i) => {
			const c = new Color(hex);
			data[i * 4] = Math.floor(c.r * 255);
			data[i * 4 + 1] = Math.floor(c.g * 255);
			data[i * 4 + 2] = Math.floor(c.b * 255);
			data[i * 4 + 3] = 255;
		});

		const tex = new DataTexture(data, width, height);
		tex.needsUpdate = true;
		return tex;
	}, []);

	// Filter regions by threshold and generate circle data
	const regionCircles = useMemo(() => {
		return regions
			.filter((r) => r.max_value > threshold)
			.map((region) => {
				const colorIndex =
					(Math.floor(region.max_value) - 1) % EMISSION_MASK_COLORS.length;
				// Safety check for index
				const safeIndex =
					colorIndex >= 0 ? colorIndex : colorIndex + EMISSION_MASK_COLORS.length;
				const color = EMISSION_MASK_COLORS[safeIndex % EMISSION_MASK_COLORS.length];

				// Circle radius based on sqrt(area) for visual proportionality
				const radius = CIRCLE_RADIUS;
				const points = generateCirclePoints(
					region.center_x,
					-region.center_y, // Flip Y axis
					radius,
					32,
					circleZ,
				);
				return { region, color, points };
			});
	}, [regions, threshold, circleZ]);

	if (!isVisible || !texture || !width || !height) return null;

	// Position the mesh based on mask bounds
	const meshX = xStart + width / 2;
	const meshY = -(yStart + height / 2);
	return (
		<>
			{/* Heatmap layer */}
			<mesh position={[meshX, meshY, meshZ]}>
				<planeGeometry args={[width, height]} />
				<emissionMaskMaterial
					uTexture={texture}
					uMaxValue={maxValue}
					uThreshold={threshold}
					uPalette={paletteTexture}
					uPaletteSize={EMISSION_MASK_COLORS.length}
					transparent={true}
					side={DoubleSide}
					depthWrite={false}
				/>
			</mesh>

			{/* Region marker circles */}
			{regionCircles.map(({ region, color, points }, index) => (
				<Line
					key={`region-${index}-${region.center_x}-${region.center_y}`}
					points={points}
					color={color}
					lineWidth={CIRCLE_LINE_WIDTH}
					transparent
					opacity={0.9}
				/>
			))}
		</>
	);
}
