"use client";

export type TargetHubMode = "icon" | "dock";

export type BeaconRevealState = "hidden" | "peek" | "reveal";

export type BeaconEffectKind =
	| "active-switch"
	| "source-ready"
	| "fit-ready"
	| "source-error";

export interface BeaconEffect {
	token: number;
	kind: BeaconEffectKind;
	color: string;
}

export interface TargetHubMockSession {
	label: string;
	status: string;
	color: string;
}

export interface TargetHubDebugAPI {
	setMode: (mode: TargetHubMode) => void;
	emitEffect: (kind: BeaconEffectKind) => void;
	getState: () => {
		mode: TargetHubMode;
		reveal: BeaconRevealState;
		beaconYRatio: number;
	};
}

declare global {
	interface Window {
		__targetHubDebug?: TargetHubDebugAPI;
	}
}
