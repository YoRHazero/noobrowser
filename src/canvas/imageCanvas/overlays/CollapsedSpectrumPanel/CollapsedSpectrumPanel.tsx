import { Box, VStack } from "@chakra-ui/react";
import type { CollapsedSpectrumViewModel } from "../../shared/types";
import { CollapsedSpectrumChart } from "./CollapsedSpectrumChart";
import { CollapsedSpectrumControls } from "./CollapsedSpectrumControls";
import { useCollapsedSpectrumPanel } from "./useCollapsedSpectrumPanel";

export function CollapsedSpectrumPanel({
	spectrum,
}: {
	spectrum: CollapsedSpectrumViewModel | null;
}) {
	const view = useCollapsedSpectrumPanel(spectrum);

	return (
		<VStack w="100%" h="100%" gap={0} align="stretch">
			<Box flex="1 1 0" minH={0}>
				<CollapsedSpectrumChart
					spectrum={spectrum}
					points={view.points}
					scales={view.scales}
					fwhmKmS={view.fwhmKmS}
					onReferenceDrag={view.setReferenceFromSvgX}
				/>
			</Box>
			<CollapsedSpectrumControls
				referencePixel={view.referencePixel}
				referenceWavelengthAngstrom={view.referenceWavelengthAngstrom}
				fwhmKmS={view.fwhmKmS}
				onReferenceWavelengthChange={view.setReferenceWavelengthAngstrom}
				onFwhmChange={view.setFwhmKmS}
			/>
		</VStack>
	);
}
