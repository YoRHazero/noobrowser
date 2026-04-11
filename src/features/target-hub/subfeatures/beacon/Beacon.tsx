"use client";

import { Box, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { TARGET_HUB_Z_INDEX } from "../../shared/constants";
import { hexToRgb } from "./animations/effects";
import { beaconRecipe } from "./beacon.recipe";
import { useBeacon } from "./useBeacon";

const BEACON_ACCENT_COLOR = "#22d3ee";

export default function Beacon() {
	const { reveal, isAnchorDragging, effect, top, onPointerDown, onClick } =
		useBeacon();
	const recipe = useSlotRecipe({ recipe: beaconRecipe });
	const effectKind = effect?.kind ?? "none";
	const styles = recipe({ reveal, isAnchorDragging, effectKind });

	return (
		<Box
			css={styles.root}
			style={
				{
					top: `${top}px`,
					"--target-hub-z-index": TARGET_HUB_Z_INDEX,
					"--target-hub-color": BEACON_ACCENT_COLOR,
					"--target-hub-color-rgb": hexToRgb(BEACON_ACCENT_COLOR),
					...(effect
						? {
								"--target-hub-effect-color": effect.color,
								"--target-hub-effect-rgb": hexToRgb(effect.color),
							}
						: {}),
				} as CSSProperties
			}
		>
			<Box css={styles.glow} />
			<Box
				as="button"
				aria-label="Open Target Hub"
				css={styles.shell}
				onPointerDown={onPointerDown}
				onClick={onClick}
			>
				<Box css={styles.core} />
			</Box>
			{effect ? (
				<Box css={styles.effectLayer}>
					{effect.kind === "source-ready" ? (
						<Box key={`streak-${effect.token}`} css={styles.streak} />
					) : null}
					{effect.kind === "active-switch" ||
					effect.kind === "source-ready" ||
					effect.kind === "fit-ready" ? (
						<Box
							key={`ring-primary-${effect.token}`}
							css={styles.primaryRing}
						/>
					) : null}
					{effect.kind === "fit-ready" ? (
						<Box
							key={`ring-secondary-${effect.token}`}
							css={styles.secondaryRing}
						/>
					) : null}
					{effect.kind === "source-error" ? (
						<Box key={`rim-${effect.token}`} css={styles.rim} />
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
