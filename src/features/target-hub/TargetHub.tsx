"use client";

import { Portal } from "@chakra-ui/react";
import { DarkMode } from "@/components/ui/color-mode";
import Beacon from "./subfeatures/beacon";
import Dock from "./subfeatures/dock";
import Sheet from "./subfeatures/sheet";
import { useTargetHub } from "./useTargetHub";

export default function TargetHub() {
	const { mode } = useTargetHub();

	return (
		<Portal>
			<DarkMode>
				{mode === "icon" ? <Beacon /> : mode === "dock" ? <Dock /> : <Sheet />}
			</DarkMode>
		</Portal>
	);
}
