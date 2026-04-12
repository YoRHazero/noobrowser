"use client";

import type { SourceImageRef, SourceVisibility } from "@/stores/source";

export type TargetHubMode = "icon" | "dock" | "sheet";

export type BeaconRevealState = "hidden" | "peek" | "reveal";

export type TargetHubEditorMode = "detail" | "create";

export type BeaconEffectKind =
	| "active-switch"
	| "source-ready"
	| "fit-ready"
	| "fit-error"
	| "source-error";

export interface BeaconEffect {
	token: number;
	kind: BeaconEffectKind;
	color: string;
}

export interface TargetHubCreateDraft {
	label: string;
	position: {
		ra: string;
		dec: string;
		x: number | null;
		y: number | null;
	};
	imageRef: SourceImageRef;
	visibility: SourceVisibility;
}

export interface TargetHubExtractionDraft {
	apertureSize: number;
	waveMinUm: number;
	waveMaxUm: number;
}
