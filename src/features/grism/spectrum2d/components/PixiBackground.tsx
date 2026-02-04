
// @/features/grism/spectrum2d/components/PixiBackground.tsx
import { useApplication } from "@pixi/react";
import { useEffect } from "react";

export function PixiBackground({ color }: { color: number }) {
	const { app } = useApplication();
	useEffect(() => {
		const renderer = app?.renderer;
		if (!renderer) return;
		if ("background" in renderer && renderer.background) {
			renderer.background.color = color;
		} else {
			(renderer as { backgroundColor?: number }).backgroundColor = color;
		}
	}, [app, color]);
	return null;
}
