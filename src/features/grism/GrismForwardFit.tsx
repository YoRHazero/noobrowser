"use client";

import { Box, Separator } from "@chakra-ui/react";
import { Panel, panelStyles } from "@/components/layout/Panel";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import FitHeader from "@/features/grism/forwardfit/FitHeader";
import FitModelTransferListBox from "@/features/grism/forwardfit/FitModelTransferListBox";
import FitModelsSection from "@/features/grism/forwardfit/FitModelsSection";

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
