import { Box, Stack } from "@chakra-ui/react";
import { AddLineRow } from "./parts/AddLineRow";
import { EmissionLineList } from "./parts/EmissionLineList";
import { PresetRow } from "./parts/PresetRow";
import { useSpectrumWorkspaceEmissionLines } from "./useSpectrumWorkspaceEmissionLines";

export function SpectrumWorkspaceEmissionLines() {
	const emissionLines = useSpectrumWorkspaceEmissionLines();

	return (
		<Stack h="full" minH={0} gap={0}>
			<Box px={4} py={4} borderBottomWidth="1px" borderColor="border.muted">
				<AddLineRow {...emissionLines.addLineRow} />
			</Box>

			<Box px={4} py={4} borderBottomWidth="1px" borderColor="border.muted">
				<PresetRow
					key={emissionLines.presetRow.selectedPresetName ?? "__none__"}
					{...emissionLines.presetRow}
				/>
			</Box>

			<Box flex="1" minH={0}>
				<EmissionLineList {...emissionLines.emissionLineList} />
			</Box>
		</Stack>
	);
}
