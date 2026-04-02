"use client";

import { Portal } from "@chakra-ui/react";
import { useEffect } from "react";
import TargetHubBeacon from "./beacon";
import TargetHubDock from "./dock";
import { useTargetHubFeedbackLifecycle } from "./hooks/useTargetHubFeedbackLifecycle";
import { targetHubMockSession } from "./mocks";
import type { BeaconEffectKind } from "./shared/types";
import { useTargetHubStore } from "./store";

export default function TargetHubRoot() {
	useTargetHubFeedbackLifecycle();

	const mode = useTargetHubStore((state) => state.mode);
	const setMode = useTargetHubStore((state) => state.setMode);
	const emitEffect = useTargetHubStore((state) => state.emitEffect);

	useEffect(() => {
		if (!import.meta.env.DEV) return undefined;

		window.__targetHubDebug = {
			setMode,
			emitEffect: (kind: BeaconEffectKind) =>
				emitEffect(kind, targetHubMockSession.color),
			getState: () => {
				const state = useTargetHubStore.getState();
				return {
					mode: state.mode,
					reveal: state.reveal,
					beaconYRatio: state.beaconYRatio,
				};
			},
		};

		return () => {
			delete window.__targetHubDebug;
		};
	}, [emitEffect, setMode]);

	return (
		<Portal>{mode === "icon" ? <TargetHubBeacon /> : <TargetHubDock />}</Portal>
	);
}
