import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
	CanvasTexture,
	MathUtils,
	type PerspectiveCamera,
	type Sprite,
} from "three";
import {
	MANUAL_TARGET_RADIUS_OFFSET,
	TARGET_MARKER_SIZE_PX,
} from "@/features/overview/shared/constants";
import type { WorldCoordinate } from "@/features/overview/shared/types";
import { raDecToCartesian } from "@/features/overview/utils/celestial";

export interface ManualTargetMarkerProps {
	coordinate: WorldCoordinate;
	radius: number;
	variant?: "committed" | "draft" | "selected";
}

let circleTexture: CanvasTexture | null = null;

function getCircleTexture() {
	if (circleTexture) {
		return circleTexture;
	}

	const canvas = document.createElement("canvas");
	canvas.width = 64;
	canvas.height = 64;

	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("Failed to create target marker texture.");
	}

	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "#ffffff";
	context.beginPath();
	context.arc(32, 32, 24, 0, Math.PI * 2);
	context.fill();

	circleTexture = new CanvasTexture(canvas);
	circleTexture.needsUpdate = true;
	return circleTexture;
}

const TARGET_MARKER_COLORS = {
	committed: "#84cc16",
	draft: "#f8fafc",
	selected: "#22d3ee",
} as const;

export function ManualTargetMarker({
	coordinate,
	radius,
	variant = "committed",
}: ManualTargetMarkerProps) {
	const { camera, size } = useThree();
	const spriteRef = useRef<Sprite | null>(null);
	const texture = useMemo(() => getCircleTexture(), []);
	const position = useMemo(
		() => raDecToCartesian(coordinate, radius * MANUAL_TARGET_RADIUS_OFFSET),
		[coordinate, radius],
	);

	useFrame(() => {
		const sprite = spriteRef.current;
		if (!sprite || !("fov" in camera)) {
			return;
		}

		const perspectiveCamera = camera as PerspectiveCamera;
		const distance = camera.position.distanceTo(sprite.position);
		const worldHeight =
			2 * Math.tan(MathUtils.degToRad(perspectiveCamera.fov) / 2) * distance;
		const scale = (TARGET_MARKER_SIZE_PX / size.height) * worldHeight;

		sprite.scale.set(scale, scale, 1);
	});

	return (
		<sprite
			ref={spriteRef}
			position={[position.x, position.y, position.z]}
			renderOrder={variant === "draft" ? 8 : variant === "selected" ? 7 : 6}
		>
			<spriteMaterial
				map={texture}
				color={TARGET_MARKER_COLORS[variant]}
				transparent={true}
				opacity={variant === "draft" ? 0.94 : 1}
				alphaTest={0.1}
				depthTest={true}
				depthWrite={false}
				toneMapped={false}
			/>
		</sprite>
	);
}
