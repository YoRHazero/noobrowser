"use client";

import { HStack, SegmentGroup, Stack, Text } from "@chakra-ui/react";
import type { WaveFrame, WaveUnit } from "@/stores/stores-types";
import { useWavelengthControl } from "./hooks/useWavelengthControl";

export default function WavelengthControls() {
	const { waveFrame, setWaveFrame, waveUnit, setWaveUnit } =
		useWavelengthControl();

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
