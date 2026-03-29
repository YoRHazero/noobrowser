import { GraticuleLines } from "../objects/GraticuleLines";
import type { GraticuleLine } from "@/features/overview/utils/types";

export interface GraticuleLayerProps {
	visible: boolean;
	lines: GraticuleLine[];
}

export function GraticuleLayer({ visible, lines }: GraticuleLayerProps) {
	if (!visible) return null;

	return <GraticuleLines lines={lines} color="#4f667a" opacity={0.4} />;
}
