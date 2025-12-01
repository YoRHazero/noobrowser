// features/grism/GrismWavelengthControl.tsx
"use client";

import { HStack, SegmentGroup, Stack, Text } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";

import { useFitStore, type WaveFrame } from "@/stores/fit";
import type { WaveUnit } from "@/stores/image";
import { useGrismStore } from "@/stores/image";

export default function GrismWavelengthControl() {
	const { waveFrame, setWaveFrame } = useFitStore(
		useShallow((state) => ({
			waveFrame: state.waveFrame,
			setWaveFrame: state.setWaveFrame,
		})),
	);

	const { waveUnit, setWaveUnit } = useGrismStore(
		useShallow((state) => ({
			waveUnit: state.waveUnit,
			setWaveUnit: state.setWaveUnit,
		})),
	);

	return (
		<HStack gap={1} align="flex-start">
			<Stack gap={1}>
				<Text textStyle="xs" color="fg.muted">
					Frame
				</Text>
				<SegmentGroup.Root
					size="xs"
					value={waveFrame}
					onValueChange={(e) => {
						const next = e.value as WaveFrame;
						if (next === "observe" || next === "rest") {
							setWaveFrame(next);
						}
					}}
				>
					<SegmentGroup.Indicator />
					<SegmentGroup.Items
						items={[
							{ value: "observe", label: "Obs" },
							{ value: "rest", label: "Rest" },
						]}
					/>
				</SegmentGroup.Root>
			</Stack>

			<Stack gap={1}>
				<Text textStyle="xs" color="fg.muted">
					λ unit
				</Text>
				<SegmentGroup.Root
					size="xs"
					value={waveUnit}
					onValueChange={(e) => {
						const next = e.value as WaveUnit;
						if (next === "µm" || next === "Å") {
							setWaveUnit(next);
						}
					}}
				>
					<SegmentGroup.Indicator />
					<SegmentGroup.Items
						items={[
							{ value: "µm", label: "μm" },
							{ value: "Å", label: "Å" },
						]}
					/>
				</SegmentGroup.Root>
			</Stack>
		</HStack>
	);
}
