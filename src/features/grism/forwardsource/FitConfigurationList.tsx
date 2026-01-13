import {
	Badge,
	Box,
	HStack,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import GrismForwardPriorDrawer from "@/features/grism/GrismForwardPriorDrawer";
import FitConfigurationCard from "./components/FitConfigurationCard";
import { SectionHeader } from "./components/SectionHeader";
import { useFitConfigurationList } from "./hooks/useFitConfigurationList";
import { fitConfigurationListRecipe } from "./recipes/fit-configuration-list.recipe";

export default function FitConfigurationList() {
	const {
		configurations,
		editingId,
		openPrior,
		closePrior,
		removeConfig,
		toggleConfigurationSelection,
	} = useFitConfigurationList();

	const recipe = useSlotRecipe({ recipe: fitConfigurationListRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<SectionHeader
				title="Fit Configurations"
				rightSlot={
					<Badge variant="surface" colorPalette="cyan" size="sm">
						{configurations.length}
					</Badge>
				}
			/>

			{configurations.length === 0 ? (
				<Box css={styles.emptyState}>
					<Text css={styles.emptyTitle}>NO CONFIGURATIONS FOUND</Text>
					<Text css={styles.emptySubtitle}>
						Save a model set in "Fit" panel first
					</Text>
				</Box>
			) : (
				<Box css={styles.scrollArea}>
					<HStack css={styles.listRow}>
						{configurations.map((config) => (
							<FitConfigurationCard
								key={config.id}
								config={config}
								onToggle={toggleConfigurationSelection}
								onOpenPrior={openPrior}
								onRemove={removeConfig}
							/>
						))}
					</HStack>
				</Box>
			)}

			<GrismForwardPriorDrawer
				configId={editingId}
				isOpen={Boolean(editingId)}
				onClose={closePrior}
			/>
		</Stack>
	);
}
