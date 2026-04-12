import { GraticuleLines } from "../objects/GraticuleLines";
import type { GraticuleLine } from "../shared/types";

export interface GraticuleLayerProps {
	visible: boolean;
	lines: GraticuleLine[];
}

export function GraticuleLayer({ visible, lines }: GraticuleLayerProps) {
	if (!visible) return null;

	return <GraticuleLines lines={lines} opacity={0.4} />;
}
