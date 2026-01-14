"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import EmissionLinesManager from "@/features/grism/forwardcontrol/EmissionLinesManager";
import ExtractionControls from "@/features/grism/forwardcontrol/ExtractionControls";
import RedshiftControls from "@/features/grism/forwardcontrol/RedshiftControls";

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
