import { useMemo, useRef } from "react";
import { CanvasTexture, type Sprite } from "three";
import type { MapCanvasSourceModel } from "../api";
import { useScreenPixelSpriteScale } from "../canvasHooks/useScreenPixelSpriteScale";
import {
	MAP_CANVAS_SOURCE_MARKER_ACTIVE_CORE_OPACITY,
	MAP_CANVAS_SOURCE_MARKER_ACTIVE_CORE_SIZE_SCALE,
	MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_COLOR,
	MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_OPACITY,
	MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_SIZE_SCALE,
	MAP_CANVAS_SOURCE_MARKER_INACTIVE_OPACITY,
	MAP_CANVAS_SOURCE_MARKER_RADIUS_OFFSET,
	MAP_CANVAS_SOURCE_MARKER_SIZE_PX,
} from "../shared/constants";
import { raDecToCartesian } from "../utils";

export interface SourceMarkerProps {
	source: MapCanvasSourceModel;
	radius: number;
	active: boolean;
}

interface PixelCircleSpriteProps {
	texture: CanvasTexture;
	color: string;
	opacity: number;
	renderOrder: number;
	sizePx: number;
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
		throw new Error("Failed to create map canvas source marker texture.");
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

function PixelCircleSprite({
	texture,
	color,
	opacity,
	renderOrder,
	sizePx,
}: PixelCircleSpriteProps) {
	const spriteRef = useRef<Sprite | null>(null);
	useScreenPixelSpriteScale({
		spriteRef,
		sizePx,
	});

	return (
		<sprite ref={spriteRef} renderOrder={renderOrder}>
			<spriteMaterial
				map={texture}
				color={color}
				transparent={true}
				opacity={opacity}
				alphaTest={0.1}
				depthTest={true}
				depthWrite={false}
				toneMapped={false}
			/>
		</sprite>
	);
}

export function SourceMarker({ source, radius, active }: SourceMarkerProps) {
	const texture = useMemo(() => getCircleTexture(), []);
	const position = raDecToCartesian(
		source.coordinate,
		radius * MAP_CANVAS_SOURCE_MARKER_RADIUS_OFFSET,
	);
	const markerSizePx = active
		? MAP_CANVAS_SOURCE_MARKER_SIZE_PX *
			MAP_CANVAS_SOURCE_MARKER_ACTIVE_CORE_SIZE_SCALE
		: MAP_CANVAS_SOURCE_MARKER_SIZE_PX;
	const haloSizePx =
		MAP_CANVAS_SOURCE_MARKER_SIZE_PX *
		MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_SIZE_SCALE;
	const opacity = active
		? MAP_CANVAS_SOURCE_MARKER_ACTIVE_CORE_OPACITY
		: MAP_CANVAS_SOURCE_MARKER_INACTIVE_OPACITY;

	return (
		<group position={[position.x, position.y, position.z]}>
			{active ? (
				<PixelCircleSprite
					texture={texture}
					color={MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_COLOR}
					opacity={MAP_CANVAS_SOURCE_MARKER_ACTIVE_HALO_OPACITY}
					renderOrder={20}
					sizePx={haloSizePx}
				/>
			) : null}
			<PixelCircleSprite
				texture={texture}
				color={source.color}
				opacity={opacity}
				renderOrder={21}
				sizePx={markerSizePx}
			/>
		</group>
	);
}
