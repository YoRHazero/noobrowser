"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import EmissionLinesManager from "./EmissionLinesManager";
import ExtractionControls from "./ExtractionControls";
import RedshiftControls from "./RedshiftControls";

export default function GrismForwardControl() {
	return (
		<Panel>
			<Box css={panelStyles.topSection}>
				<RedshiftControls />
				<Separator css={panelStyles.divider} />
				<ExtractionControls />
			</Box>
			<EmissionLinesManager />
		</Panel>
	);
}
