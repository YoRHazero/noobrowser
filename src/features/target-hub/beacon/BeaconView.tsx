"use client";

import { Box, useSlotRecipe } from "@chakra-ui/react";
import type { CSSProperties } from "react";
import { TARGET_HUB_Z_INDEX } from "../shared/constants";
import {
	getBeaconEffectStyles,
	getBeaconGlowStyle,
} from "./animations/beacon.animations";
import { beaconRecipe } from "./recipes/beacon.recipe";
import type { BeaconViewModel } from "./useBeacon";

const BEACON_ACCENT_COLOR = "#22d3ee";

type BeaconViewProps = BeaconViewModel;

export function BeaconView({
	reveal,
	isAnchorDragging,
	effect,
	top,
	onPointerDown,
	onClick,
}: BeaconViewProps) {
	const recipe = useSlotRecipe({ recipe: beaconRecipe });
	const styles = recipe({ reveal });
	const effectStyles = effect
		? getBeaconEffectStyles(effect.kind, effect.color)
		: null;

	return (
		<Box
			css={styles.root}
			style={
				{
					top: `${top}px`,
					"--target-hub-z-index": TARGET_HUB_Z_INDEX,
					"--target-hub-color": BEACON_ACCENT_COLOR,
				} as CSSProperties
			}
		>
			<Box
				css={{ ...styles.glow, ...getBeaconGlowStyle(BEACON_ACCENT_COLOR) }}
			/>
			<Box
				as="button"
				aria-label="Open Target Hub"
				css={{
					...styles.shell,
					cursor: isAnchorDragging ? "grabbing" : styles.shell.cursor,
				}}
				onPointerDown={onPointerDown}
				onClick={onClick}
			>
				<Box
					css={styles.core}
					style={{
						backgroundColor: BEACON_ACCENT_COLOR,
						boxShadow: `0 0 18px ${BEACON_ACCENT_COLOR}`,
					}}
				/>
			</Box>
			{effect && effectStyles ? (
				<Box css={styles.effectLayer}>
					{effectStyles.streak ? (
						<Box
							key={`streak-${effect.token}`}
							position="absolute"
							left="-18px"
							top="50%"
							w="30px"
							h="2px"
							transform="translateY(-50%)"
							borderRadius="full"
							css={effectStyles.streak}
						/>
					) : null}
					{effectStyles.primaryRing ? (
						<Box
							key={`ring-primary-${effect.token}`}
							position="absolute"
							inset="8px"
							borderWidth="2px"
							borderRadius="full"
							css={effectStyles.primaryRing}
						/>
					) : null}
					{effectStyles.secondaryRing ? (
						<Box
							key={`ring-secondary-${effect.token}`}
							position="absolute"
							inset="8px"
							borderWidth="2px"
							borderRadius="full"
							css={effectStyles.secondaryRing}
						/>
					) : null}
					{effectStyles.rim ? (
						<Box
							key={`rim-${effect.token}`}
							position="absolute"
							inset="0"
							borderRadius="inherit"
							css={effectStyles.rim}
						/>
					) : null}
				</Box>
			) : null}
		</Box>
	);
}
