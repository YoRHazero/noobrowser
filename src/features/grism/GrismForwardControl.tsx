"use client";

import { Box, Flex, Separator, Stack } from "@chakra-ui/react";

import RedshiftControls from "@/features/grism/forwardcontrol/RedshiftControls";
import ExtractionControls from "@/features/grism/forwardcontrol/ExtractionControls";
import EmissionLinesManager from "@/features/grism/forwardcontrol/EmissionLinesManager";

// --- Theme Constants (Matches GrismForwardFit) ---
const THEME_STYLES = {
	container: {
		direction: "column" as const,
		h: "100%", // 保持高度一致
		gap: 0, // 使用内部 padding 控制间距，确保分割线贴边
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
	scrollSection: {
		flex: "1",
		overflow: "hidden" as const, // EmissionLinesManager handles internal scroll
		display: "flex",
		flexDirection: "column" as const,
	},
	separator: {
		borderColor: "whiteAlpha.200",
	},
};

export default function GrismForwardControl() {
	return (
		<Flex {...THEME_STYLES.container}>
			{/* --- Fixed Top Section (Controls) --- */}
			<Stack gap={5} p={4} flexShrink={0}>
				{/* 1. 红移控制 */}
				<RedshiftControls />

				<Separator {...THEME_STYLES.separator} />

				{/* 2. 提取与光谱窗口设置 */}
				<ExtractionControls />
			</Stack>

			<Separator {...THEME_STYLES.separator} />

			{/* --- Flexible Bottom Section (Emission Lines) --- */}
			<Box {...THEME_STYLES.scrollSection}>
				<EmissionLinesManager />
			</Box>
		</Flex>
	);
}