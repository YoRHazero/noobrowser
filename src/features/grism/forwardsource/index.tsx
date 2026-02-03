"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import ExtractionSettings from "./ExtractionSettings";
import FitConfigurationList from "./FitConfigurationList";
import TargetSourceList from "./TargetSourceList";

export default function GrismForwardSource() {
	return (
		<Panel>
			<Box css={panelStyles.topSection}>
				<FitConfigurationList />
				<Separator css={panelStyles.divider} />
				<ExtractionSettings />
			</Box>
			<TargetSourceList />
		</Panel>
	);
}
