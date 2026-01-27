import "@/components/three/EmissionMaskMaterial";
import { Line } from "@react-three/drei";
import { useMemo } from "react";
import { DoubleSide } from "three";
import { useEmissionMaskLayer } from "./hooks/useEmissionMaskLayer";

/**
 * Plasma colormap function (matches shader and control legend)
 */
function plasmaColor(t: number): string {
	const c0 = [0.0504, 0.0298, 0.528];
	const c1 = [2.0281, -0.0893, 0.69];
	const c2 = [-2.3053, 3.5714, -2.0145];
	const c3 = [6.8093, -6.0988, 3.1312];
	const c4 = [-5.4094, 4.3636, -1.4507];
	const c5 = [0.8394, -1.431, 0.1674];

	const r =
		c0[0] +
		t * (c1[0] + t * (c2[0] + t * (c3[0] + t * (c4[0] + t * c5[0]))));
	const g =
		c0[1] +
		t * (c1[1] + t * (c2[1] + t * (c3[1] + t * (c4[1] + t * c5[1]))));
	const b =
		c0[2] +
		t * (c1[2] + t * (c2[2] + t * (c3[2] + t * (c4[2] + t * c5[2]))));

	const toHex = (v: number) =>
		Math.round(Math.max(0, Math.min(1, v)) * 255)
			.toString(16)
			.padStart(2, "0");

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

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

	// Filter regions by threshold and generate circle data
	const regionCircles = useMemo(() => {
		return regions
			.filter((r) => r.max_value > threshold)
			.map((region) => {
				const t = region.max_value / maxValue;
				const color = plasmaColor(t);
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
	}, [regions, threshold, maxValue, circleZ]);

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
