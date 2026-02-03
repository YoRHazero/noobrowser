"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import FitHeader from "./FitHeader";
import FitModelsSection from "./FitModelsSection";
import FitModelTransferListBox from "./FitModelTransferListBox";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";

export default function GrismForwardFit() {
	return (
		<Panel>
			<Box css={panelStyles.topSection}>
				<FitHeader />
				<GrismWavelengthControl />
				<Separator css={panelStyles.divider} />
				<FitModelTransferListBox />
			</Box>
			<FitModelsSection />
		</Panel>
	);
}
