"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import FitHeader from "./FitHeader";
import FitModelsSection from "./FitModelsSection";
import FitModelTransferListBox from "./FitModelTransferListBox";

export default function GrismForwardFit() {
	return (
		<Panel>
			<Box css={panelStyles.topSection}>
				<FitHeader />
				<Separator css={panelStyles.divider} />
				<FitModelTransferListBox />
			</Box>
			<FitModelsSection />
		</Panel>
	);
}
