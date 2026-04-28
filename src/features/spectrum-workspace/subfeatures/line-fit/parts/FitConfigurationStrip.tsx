import { Box, HStack, IconButton } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitConfigurationStripModel } from "../useSpectrumWorkspaceLineFit";
import { FitConfigurationCard } from "./FitConfigurationCard";

export function FitConfigurationStrip({
	configurations,
	canCreateConfiguration,
	onCreateConfiguration,
}: FitConfigurationStripModel) {
	return (
		<HStack gap={2} overflowX="auto" pb={1} align="stretch">
			<Box
				position="sticky"
				left={0}
				zIndex={1}
				bg="bg.panel"
				flex="0 0 auto"
				pr={1}
			>
				<Tooltip
					content={
						canCreateConfiguration
							? "Create fit configuration"
							: "Current slice is not ready"
					}
				>
					<IconButton
						aria-label="Create fit configuration"
						size="sm"
						variant="outline"
						minW="4rem"
						h="3.875rem"
						disabled={!canCreateConfiguration}
						onClick={onCreateConfiguration}
					>
						<Plus size={16} />
					</IconButton>
				</Tooltip>
			</Box>

			{configurations.map((configuration) => (
				<FitConfigurationCard key={configuration.id} {...configuration} />
			))}
		</HStack>
	);
}
