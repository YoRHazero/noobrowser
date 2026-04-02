"use client";

import { Box, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { targetHubMockSession } from "../mocks";
import { TARGET_HUB_Z_INDEX } from "../shared/constants";
import { useTargetHubStore } from "../store";
import { BeaconCore } from "./components/BeaconCore";
import { BeaconEffectLayer } from "./components/BeaconEffectLayer";
import { BeaconGlow } from "./components/BeaconGlow";
import { useBeaconAttentionFromEffect } from "./hooks/useBeaconAttentionFromEffect";
import { useBeaconDrag } from "./hooks/useBeaconDrag";
import { useBeaconProximity } from "./hooks/useBeaconProximity";
import { beaconRecipe } from "./recipes/beacon.recipe";

export default function TargetHubBeacon() {
	useBeaconAttentionFromEffect();
	useBeaconProximity();

	const reveal = useTargetHubStore((state) => state.reveal);
	const isDragging = useTargetHubStore((state) => state.isDragging);
	const effect = useTargetHubStore((state) => state.effect);
	const { top, handlePointerDown, handleClick } = useBeaconDrag();

	const recipe = useSlotRecipe({ recipe: beaconRecipe });
	const styles = recipe({ reveal });

	return (
		<Box
			css={styles.root}
			style={
				{
					top: `${top}px`,
					"--target-hub-z-index": TARGET_HUB_Z_INDEX,
					"--target-hub-color": targetHubMockSession.color,
				} as CSSProperties
			}
		>
			<BeaconGlow color={targetHubMockSession.color} css={styles.glow} />
			<BeaconCore
				color={targetHubMockSession.color}
				shellCss={styles.shell}
				coreCss={styles.core}
				isDragging={isDragging}
				onPointerDown={handlePointerDown}
				onClick={handleClick}
			/>
			<BeaconEffectLayer effect={effect} css={styles.effectLayer} />
		</Box>
	);
}
