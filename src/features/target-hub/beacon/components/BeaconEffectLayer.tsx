import type { SystemStyleObject } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { BeaconEffect } from "../../shared/types";
import { getBeaconEffectStyles } from "../animations/beacon.animations";

interface BeaconEffectLayerProps {
	effect: BeaconEffect | null;
	css: SystemStyleObject;
}

export function BeaconEffectLayer({ effect, css }: BeaconEffectLayerProps) {
	if (!effect) return null;

	const styles = getBeaconEffectStyles(effect.kind, effect.color);

	return (
		<Box css={css}>
			{styles.streak ? (
				<Box
					key={`streak-${effect.token}`}
					position="absolute"
					left="-18px"
					top="50%"
					w="30px"
					h="2px"
					transform="translateY(-50%)"
					borderRadius="full"
					css={styles.streak}
				/>
			) : null}
			{styles.primaryRing ? (
				<Box
					key={`ring-primary-${effect.token}`}
					position="absolute"
					inset="8px"
					borderWidth="2px"
					borderRadius="full"
					css={styles.primaryRing}
				/>
			) : null}
			{styles.secondaryRing ? (
				<Box
					key={`ring-secondary-${effect.token}`}
					position="absolute"
					inset="8px"
					borderWidth="2px"
					borderRadius="full"
					css={styles.secondaryRing}
				/>
			) : null}
			{styles.rim ? (
				<Box
					key={`rim-${effect.token}`}
					position="absolute"
					inset="0"
					borderRadius="inherit"
					css={styles.rim}
				/>
			) : null}
		</Box>
	);
}
