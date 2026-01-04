"use client";

import { Box, Flex, Separator, Stack } from "@chakra-ui/react";

// Hook (Controller)
import { useConfigurationSubmitController } from "@/hook/fit-submit-hook";

// View Components
import FitConfigurationList from "@/features/grism/forwardsource/FitConfigurationList";
import ExtractionSettings from "@/features/grism/forwardsource/ExtractionSettings";
import TargetSourceList from "@/features/grism/forwardsource/TargetSourceList";

// --- Theme Constants ---
const THEME_STYLES = {
	container: {
		direction: "column" as const,
		h: "100%", // 保持与 Fit 标签页高度一致
		gap: 0, 
		borderRadius: "md",
		borderWidth: "1px",
		borderColor: "border.subtle",
		position: "relative" as const,
		overflow: "hidden" as const,
		// 深空背景 / 仪表盘背景
		bgGradient: {
			base: "linear(to-b, gray.50, blue.50)",
			_dark: `radial-gradient(circle at 100% 0%, rgba(128, 90, 213, 0.15) 0%, transparent 40%), 
                    radial-gradient(circle at 0% 100%, rgba(56, 178, 172, 0.15) 0%, transparent 40%), 
                    linear-gradient(to bottom, #1a202c, #171923)`,
		},
		boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
	},
	headerSection: {
		gap: 5,
		p: 4,
		pb: 2,
		flexShrink: 0,
		zIndex: 1,
        borderBottomWidth: "1px",
        borderColor: "whiteAlpha.100",
	},
	scrollSection: {
		flex: "1",
		overflow: "hidden" as const, 
		display: "flex",
		flexDirection: "column" as const,
        position: "relative" as const,
	},
    separator: {
        borderColor: "whiteAlpha.200",
    }
};

export default function GrismForwardSource() {
    const controller = useConfigurationSubmitController();

    return (
        <Flex {...THEME_STYLES.container}>
            {/* Top Section: Configs & Extraction Settings */}
            <Stack {...THEME_STYLES.headerSection}>
                <FitConfigurationList />
                
                <Separator {...THEME_STYLES.separator} />
                
                <ExtractionSettings 
                    apertureSize={controller.extractionParams.apertureSize}
                    setApertureSize={controller.extractionParams.setApertureSize}
                    extractMode={controller.extractionParams.extractMode}
                    setExtractMode={controller.extractionParams.setExtractMode}
                />
            </Stack>

            {/* Bottom Section: Sources List */}
            <Box {...THEME_STYLES.scrollSection}>
                <TargetSourceList 
                    readySources={controller.readySources}
                    selectedSourceId={controller.displayedTraceSourceId}
                    hasSelectedConfig={controller.hasSelectedConfig}
                    onSelectSource={controller.handleSelectSource}
                    onRunFit={controller.handleRunFit}
                />
            </Box>
        </Flex>
    );
}