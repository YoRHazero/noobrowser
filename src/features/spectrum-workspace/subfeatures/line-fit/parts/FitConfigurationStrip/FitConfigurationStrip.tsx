import { Box, HStack, IconButton, useSlotRecipe } from "@chakra-ui/react";
import { Plus } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type { FitConfigurationStripModel } from "../../hooks/lineFitModels";
import { FitConfigurationCard } from "../FitConfigurationCard";
import { fitConfigurationStripRecipe } from "./FitConfigurationStrip.recipe";

export function FitConfigurationStrip({
	configurations,
	canCreateConfiguration,
	onCreateConfiguration,
}: FitConfigurationStripModel) {
	const recipe = useSlotRecipe({ recipe: fitConfigurationStripRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.root}>
			<Box css={styles.createRail}>
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
						css={styles.createButton}
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
