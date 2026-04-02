import type { SystemStyleObject } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { getBeaconGlowStyle } from "../animations/beacon.animations";

interface BeaconGlowProps {
	color: string;
	css: SystemStyleObject;
}

export function BeaconGlow({ color, css }: BeaconGlowProps) {
	return <Box css={{ ...css, ...getBeaconGlowStyle(color) }} />;
}
