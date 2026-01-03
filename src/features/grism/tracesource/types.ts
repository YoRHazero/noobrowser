import type { TraceSource } from "@/stores/stores-types";

export interface GlobalSettings {
	apertureSize: number;
	waveMin: number;
	waveMax: number;
}

export type SetSettings = (
	value: GlobalSettings | ((prev: GlobalSettings) => GlobalSettings),
) => void;

export type UpdateSource = (id: string, patch: Partial<TraceSource>) => void;
