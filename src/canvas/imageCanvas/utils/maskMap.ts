import { Color } from "three";
import type { MaskMapEntry } from "../api";
import { IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES } from "../shared/constants";

export interface MaskMapUniformEntry {
	valueBytes: [number, number, number, number];
	color: [number, number, number, number];
}

export function numberToUint32Bytes(
	value: number,
): [number, number, number, number] {
	const normalized = Math.max(0, Math.trunc(value)) >>> 0;
	return [
		normalized & 0xff,
		(normalized >>> 8) & 0xff,
		(normalized >>> 16) & 0xff,
		(normalized >>> 24) & 0xff,
	];
}

export function createMaskMapUniformEntries(
	maskMap: MaskMapEntry[],
): MaskMapUniformEntry[] {
	return maskMap.slice(0, IMAGE_CANVAS_MAX_MASK_MAP_ENTRIES).map((entry) => {
		const color = new Color(entry.color);
		return {
			valueBytes: numberToUint32Bytes(entry.value),
			color: [
				color.r,
				color.g,
				color.b,
				Math.max(0, Math.min(1, entry.opacity ?? 1)),
			],
		};
	});
}
