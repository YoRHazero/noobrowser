"use client";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import FitHeader from "@/deprecated/forwardfit/FitHeader";
import FitModelTransferListBox from "@/deprecated/forwardfit/FitModelTransferListBox";
import GaussianModelCard from "@/deprecated/forwardfit/GaussianModelCard";
import LinearModelCard from "@/deprecated/forwardfit/LinearModelCard";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";

// --- Theme Constants (Instrument Panel Style) ---
const THEME_STYLES = {
	container: {
		direction: "column" as const,
		h: "100%", 
		gap: 3,
		p: 3,
		borderRadius: "md",
		borderWidth: "1px",
		borderColor: "border.subtle",
		position: "relative" as const,
		overflow: "hidden" as const,
		bgGradient: {
			base: "linear(to-b, gray.50, blue.50)",
			_dark: `radial-gradient(circle at 100% 0%, rgba(128, 90, 213, 0.15) 0%, transparent 40%), 
                    radial-gradient(circle at 0% 100%, rgba(56, 178, 172, 0.15) 0%, transparent 40%), 
                    linear-gradient(to bottom, #1a202c, #171923)`, 
		},
		boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)",
	},
	headerSection: {
		gap: 3,
		flexShrink: 0,
		zIndex: 1,
		bg: "transparent",
	},
	separator: {
		pt: 2,
		pb: 2,
		borderBottomWidth: "1px",
		borderColor: "whiteAlpha.200",
	},
	scrollArea: {
		flex: "1",
		overflowY: "auto" as const,
		pr: 1,
		zIndex: 1,
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