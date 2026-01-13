"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import RedshiftControls from "@/features/grism/forwardcontrolnew/RedshiftControls";
import ExtractionControls from "@/features/grism/forwardcontrolnew/ExtractionControls";
import EmissionLinesManager from "@/features/grism/forwardcontrolnew/EmissionLinesManager";

export default function GrismForwardControlNew() {
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
