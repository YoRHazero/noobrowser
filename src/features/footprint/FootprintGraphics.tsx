import { extend } from "@pixi/react";
import {
	Container,
	type FederatedPointerEvent,
	Graphics,
	Polygon,
} from "pixi.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useGlobeStore } from "@/stores/footprints";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { projectRaDec, toScreen } from "@/utils/projection";

extend({
	Graphics,
	Container,
});

function FootprintItem({
	id,
	screenVertices,
	layerRef,
}: {
	id: string;
	screenVertices: { x: number; y: number }[];
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	// Attach to the RenderLayer
	const graphicsRef = useRef<Graphics | null>(null);
	useEffect(() => {
		const layer = layerRef.current;
		const node = graphicsRef.current;
		if (!layer || !node) return;

		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef]);

	// Setup for footprint
	const colorSetup = {
		strokeNormal: 0x632652,
		hoveredFill: 0x333333,
		strokeSelected: 0xaa0000,
	};
	const hoveredFootprintId = useGlobeStore((state) => state.hoveredFootprintId);
	const selectedFootprintId = useGlobeStore(
		(state) => state.selectedFootprintId,
	);
	const footprintState =
		id === selectedFootprintId
			? "selected"
			: id === hoveredFootprintId
				? "hovered"
				: "normal";

	const hitArea = useMemo(() => {
		const flat = screenVertices.flatMap((v) => [v.x, v.y]);
		return new Polygon(flat);
	}, [screenVertices]);

	const draw = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics.poly(screenVertices, true);
			switch (footprintState) {
				case "normal":
					graphics.stroke({ color: colorSetup.strokeNormal, width: 1 });
					break;
				case "hovered":
					graphics
						.fill({ color: colorSetup.hoveredFill, alpha: 0.3 })
						.stroke({ color: colorSetup.strokeNormal, width: 2 });
					break;
				case "selected":
					graphics.stroke({ color: colorSetup.strokeSelected, width: 2 });
					break;
			}
		},
		[screenVertices, footprintState],
	);

	const setHoveredFootprintId = useGlobeStore(
		(state) => state.setHoveredFootprintId,
	);
	const setHoveredFootprintMousePosition = useGlobeStore(
		(state) => state.setHoveredFootprintMousePosition,
	);
	const setSelectedFootprintId = useGlobeStore(
		(state) => state.setSelectedFootprintId,
	);

	const onPointerOver = (e: FederatedPointerEvent) => {
		setHoveredFootprintId(id);
		setHoveredFootprintMousePosition({ x: e.global.x, y: e.global.y });
	};

	const onPointerMove = (e: FederatedPointerEvent) => {
		if (hoveredFootprintId === id) {
			setHoveredFootprintMousePosition({ x: e.global.x, y: e.global.y });
		}
	};

	const onPointerOut = () => {
		setHoveredFootprintId(null);
		setHoveredFootprintMousePosition(null);
	};

	const onClick = () => {
		setSelectedFootprintId(id === selectedFootprintId ? null : id);
	};

	return (
		<pixiGraphics
			ref={graphicsRef}
			draw={draw}
			hitArea={hitArea}
			onPointerOver={onPointerOver}
			onPointerMove={onPointerMove}
			onPointerOut={onPointerOut}
			onClick={onClick}
			eventMode="dynamic"
			zIndex={
				footprintState === "selected" ? 2 : footprintState === "hovered" ? 1 : 0
			}
		/>
	);
}

export default function FootprintGraphics({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const footprints = useGlobeStore((state) => state.footprints);
	const view = useGlobeStore((state) => state.view);
	const globeBackground = useGlobeStore((state) => state.globeBackground);
	const { centerX, centerY, initialRadius } = globeBackground;

	// Draw Globe
	const drawGlobe = useCallback(
		(graphics: Graphics) => {
			graphics.clear();
			graphics
				.circle(centerX, centerY, initialRadius * view.scale)
				.stroke({ color: 0x000000, width: 1 });
		},
		[centerX, centerY, initialRadius, view.scale],
	);

	return (
		<pixiContainer sortableChildren={true}>
			<pixiGraphics draw={drawGlobe} />
			{footprints.map((fp) => {
				const projectedVertices = fp.vertices.map((v) =>
					projectRaDec(v.ra, v.dec, view.yawDeg, view.pitchDeg),
				);
				// Skip footprints whose vertices are not fully visible
				if (!projectedVertices.every((v) => v.visible)) {
					return;
				}

				const screenVertices = projectedVertices.map((p) =>
					toScreen(p, centerX, centerY, view.scale, initialRadius),
				);

				return (
					<FootprintItem
						key={fp.id}
						id={fp.id}
						screenVertices={screenVertices}
						layerRef={layerRef}
					/>
				);
			})}
		</pixiContainer>
	);
}
