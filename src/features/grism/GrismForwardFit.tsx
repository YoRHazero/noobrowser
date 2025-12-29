"use client";

import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import FitHeader from "@/features/grism/forwardfit/FitHeader";
import FitModelTransferListBox from "@/features/grism/forwardfit/FitModelTransferListBox";
import GaussianModelCard from "@/features/grism/forwardfit/GaussianModelCard";
import LinearModelCard from "@/features/grism/forwardfit/LinearModelCard";
import GrismWavelengthControl from "@/features/grism/GrismForwardWavelengthControl";
import GrismForwardPriorDrawer from "@/features/grism/GrismForwardPriorDrawer";
import { useFitStore } from "@/stores/fit";
import { useGrismStore } from "@/stores/image";

export default function GrismForwardFit() {
	// 主文件现在只需要关心：1.初始化数据，2.渲染列表
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

	// Initial Check
	useEffect(() => {
		ensureInitialModels(slice1DWaveRange);
	}, [ensureInitialModels, slice1DWaveRange]);

	return (
		<Flex
			direction="column"
			h="90vh"
			gap={3}
			p={4}
			borderWidth="1px"
			borderColor="border.subtle"
			borderRadius="md"
			bg="bg.surface"
		>
			{/* --- Header Section (Fixed) --- */}
			<Stack gap={3} flexShrink={0}>
				{/* 1. 标题和按钮组 */}
				<FitHeader />
				<GrismForwardPriorDrawer />
				{/* 2. 波长控制 */}
				<GrismWavelengthControl />

				{/* 3. 穿梭框 (放在列表上方) */}
				<Box pt={2} pb={2} borderBottomWidth="1px" borderColor="border.subtle">
					<FitModelTransferListBox />
				</Box>
			</Stack>

			{/* --- Scrollable List Section --- */}
			<Box flex="1" overflowY="auto" pr={1}>
				{models.length === 0 ? (
					<Text textStyle="sm" color="fg.muted" textAlign="center" py={4}>
						No models yet. Add one to start.
					</Text>
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