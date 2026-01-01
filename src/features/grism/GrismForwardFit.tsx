"use client";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import FitHeader from "@/features/grism/forwardfit/FitHeader";
import FitModelTransferListBox from "@/features/grism/forwardfit/FitModelTransferListBox";
import GaussianModelCard from "@/features/grism/forwardfit/GaussianModelCard";
import LinearModelCard from "@/features/grism/forwardfit/LinearModelCard";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";

// --- Theme Constants (Instrument Panel Style) ---
const THEME_STYLES = {
	container: {
		direction: "column" as const,
		// 在 Tab 内部，我们让它填满可用空间，或者给定一个适配屏幕的高度
		h: "calc(100vh - 80px)", 
		gap: 3,
		p: 3,
		borderRadius: "md",
		borderWidth: "1px",
		borderColor: "border.subtle",
		position: "relative" as const,
		overflow: "hidden" as const,
		// 核心背景：使用 CSS 渐变模拟深空/光晕，不使用额外的 DOM 元素
		bgGradient: {
			// 白天模式：保持浅色科技感，带一点蓝色微光
			base: "linear(to-b, gray.50, blue.50)",
			// 深色模式：模拟深空，右上角有紫色投射，左下角有青色投射
			_dark: `radial-gradient(circle at 100% 0%, rgba(128, 90, 213, 0.15) 0%, transparent 40%), 
                    radial-gradient(circle at 0% 100%, rgba(56, 178, 172, 0.15) 0%, transparent 40%), 
                    linear-gradient(to bottom, #1a202c, #171923)`, 
		},
		boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)", // 内阴影增加“嵌入式屏幕”的感觉
	},
	headerSection: {
		gap: 3,
		flexShrink: 0,
		zIndex: 1,
		bg: "transparent", // 确保透出背景
	},
	separator: {
		pt: 2,
		pb: 2,
		borderBottomWidth: "1px",
		borderColor: "whiteAlpha.200", // 半透明分割线
	},
	scrollArea: {
		flex: "1",
		overflowY: "auto" as const,
		pr: 1,
		zIndex: 1,
		// 自定义滚动条
		css: {
			"&::-webkit-scrollbar": { width: "4px" },
			"&::-webkit-scrollbar-track": { background: "transparent" },
			"&::-webkit-scrollbar-thumb": {
				background: "var(--chakra-colors-whiteAlpha-200)",
				borderRadius: "2px",
			},
			"&::-webkit-scrollbar-thumb:hover": {
				background: "var(--chakra-colors-whiteAlpha-400)",
			},
		},
	},
	emptyState: {
		align: "center",
		justify: "center",
		h: "full",
		opacity: 0.6,
		direction: "column" as const,
	},
};

export default function GrismForwardFit() {
	const { models, ensureInitialModels, waveFrame } = useFitStore(
		useShallow((s) => ({
			models: s.models,
			ensureInitialModels: s.ensureInitialModels,
			waveFrame: s.waveFrame,
		})),
	);

	const { slice1DWaveRange, waveUnit, zRedshift } = useGrismStore(
		useShallow((s) => ({
			slice1DWaveRange: s.slice1DWaveRange,
			waveUnit: s.waveUnit,
			zRedshift: s.zRedshift,
		})),
	);

	useEffect(() => {
		ensureInitialModels(slice1DWaveRange);
	}, [ensureInitialModels, slice1DWaveRange]);

	return (
		<Flex {...THEME_STYLES.container}>
			
			{/* --- Header Section --- */}
			<Stack {...THEME_STYLES.headerSection}>
				<FitHeader />
				<GrismWavelengthControl />

				<Box {...THEME_STYLES.separator}>
					<FitModelTransferListBox />
				</Box>
			</Stack>

			{/* --- List Section --- */}
			<Box {...THEME_STYLES.scrollArea}>
				{models.length === 0 ? (
					<Flex {...THEME_STYLES.emptyState}>
						<Text textStyle="sm" color="fg.muted" letterSpacing="wider" fontWeight="medium">
							NO MODELS LOADED
						</Text>
						<Text textStyle="xs" color="fg.subtle" mt={1}>
							Add a signal model to begin
						</Text>
					</Flex>
				) : (
					<Stack gap={3} pb={4}>
						{models.map((model) =>
							model.kind === "linear" ? (
								<LinearModelCard
									key={model.id}
									model={model}
									waveFrame={waveFrame}
									waveUnit={waveUnit}
									zRedshift={zRedshift}
									slice1DWaveRange={slice1DWaveRange}
								/>
							) : (
								<GaussianModelCard
									key={model.id}
									model={model}
									waveFrame={waveFrame}
									waveUnit={waveUnit}
									zRedshift={zRedshift}
									slice1DWaveRange={slice1DWaveRange}
								/>
							),
						)}
					</Stack>
				)}
			</Box>
		</Flex>
	);
}