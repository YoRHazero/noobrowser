"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import ExtractionSettings from "@/features/grism/forwardsource/ExtractionSettings";
import FitConfigurationList from "@/features/grism/forwardsource/FitConfigurationList";
import TargetSourceList from "@/features/grism/forwardsource/TargetSourceList";

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
