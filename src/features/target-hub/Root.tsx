"use client";

import { Portal } from "@chakra-ui/react";
import { DarkMode } from "@/components/ui/color-mode";
import { ModeHost } from "./ModeHost";
import Runtime from "./runtime";

export default function Root() {
	return (
		<Portal>
			<DarkMode>
				<Runtime />
				<ModeHost />
			</DarkMode>
		</Portal>
	);
}
