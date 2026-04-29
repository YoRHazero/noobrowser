import { Box, Stack, Text } from "@chakra-ui/react";
import { FitConfigurationStrip } from "./parts/FitConfigurationStrip";
import { FitModelList } from "./parts/FitModelList";
import { FitToolbar } from "./parts/FitToolbar";
import { PriorDrawer } from "./parts/PriorDrawer";
import { useSpectrumWorkspaceLineFit } from "./useSpectrumWorkspaceLineFit";

export function SpectrumWorkspaceLineFit() {
	const lineFit = useSpectrumWorkspaceLineFit();

	if (!lineFit.sourceReady) {
		return (
			<Stack h="full" minH={0} align="center" justify="center" px={4}>
				<Text fontSize="sm" color="fg.muted">
					No source selected.
				</Text>
			</Stack>
		);
	}

	return (
		<>
			<Stack h="full" minH={0} gap={0}>
				<Box px={4} py={3} borderBottomWidth="1px" borderColor="border.muted">
					<FitConfigurationStrip {...lineFit.configurationStrip} />
				</Box>

				<Box px={4} py={3} borderBottomWidth="1px" borderColor="border.muted">
					<FitToolbar {...lineFit.toolbar} />
				</Box>

				<Box flex="1" minH={0}>
					<FitModelList
						{...lineFit.modelList}
						hasSelectedConfiguration={lineFit.selectedConfiguration !== null}
					/>
				</Box>
			</Stack>
			<PriorDrawer model={lineFit.priorDrawer} />
		</>
	);
}
