import { extend, useApplication, useTick } from "@pixi/react";
import { Container, Graphics } from "pixi.js";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGlobeStore } from "@/stores/footprints";
import type { UserPoint } from "@/stores/footprints";
import type { RenderLayerInstance } from "@/types/pixi-react";
import { projectRaDec, toScreen } from "@/utils/projection";

class UserPointsContainer extends Container {
	private userPoints: UserPoint[] = [];
	private graphicsMap: Map<string, Graphics> = new Map();

	public setUserPoints(points: UserPoint[]) {
		this.userPoints = points;
		const toRemove = new Set(this.graphicsMap.keys());

		points.forEach((p) => {
			if (this.graphicsMap.has(p.id)) {
				toRemove.delete(p.id);
			} else {
				const graphics = new Graphics();
				this.addChild(graphics);
				this.graphicsMap.set(p.id, graphics);
			}
		});

		toRemove.forEach((id) => {
			const graphics = this.graphicsMap.get(id);
			if (graphics) {
				graphics.destroy();
				this.graphicsMap.delete(id);
			}
		});
	}

	public renderFrame(
		view: { yawDeg: number; pitchDeg: number; scale: number },
		globeBackground: {
			centerX: number;
			centerY: number;
			initialRadius: number;
		},
	) {
		const { centerX, centerY, initialRadius } = globeBackground;

		this.userPoints.forEach((p) => {
			const graphics = this.graphicsMap.get(p.id);
			if (!graphics) return;

			const projected = projectRaDec(p.ra, p.dec, view.yawDeg, view.pitchDeg);

			if (!projected.visible) {
				graphics.visible = false;
				return;
			}
			graphics.visible = true;

			const screenPos = toScreen(
				projected,
				centerX,
				centerY,
				view.scale,
				initialRadius,
			);

            // Draw circle
			graphics.clear();
			graphics.circle(screenPos.x, screenPos.y, 4); 
			graphics.fill({ color: 0xff0000 }); // Red color for user points
            graphics.stroke({ color: 0xffffff, width: 1 });
            
            // Bring to front
            graphics.zIndex = 10;
		});
	}
}

extend({ UserPointsContainer });

export default function UserPointsLayer({
	layerRef,
}: {
	layerRef: React.RefObject<RenderLayerInstance | null>;
}) {
	const { app } = useApplication();
	const { userPoints, globeBackground } = useGlobeStore(
		useShallow((state) => ({
			userPoints: state.userPoints,
			globeBackground: state.globeBackground,
		})),
	);

	const containerRef = useRef<UserPointsContainer | null>(null);

	// Attach to layer
	useEffect(() => {
		const layer = layerRef.current;
		const node = containerRef.current;
		if (!layer || !node) return;
		layer.attach(node);
		return () => {
			layer.detach(node);
		};
	}, [layerRef]);

	// Update points
	useEffect(() => {
		if (!containerRef.current) return;
		containerRef.current.setUserPoints(userPoints);
	}, [userPoints]);

	const viewRef = useRef(useGlobeStore.getState().view);
	useEffect(
		() =>
			useGlobeStore.subscribe((state) => {
				viewRef.current = state.view;
			}),
		[],
	);

	useTick(() => {
		if (containerRef.current && app) {
			containerRef.current.renderFrame(viewRef.current, globeBackground);
		}
	});

	return <pixiUserPointsContainer ref={containerRef} />;
}
