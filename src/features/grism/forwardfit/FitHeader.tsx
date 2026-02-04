import {
	Button,
	createListCollection,
	// Heading,
	HStack,
	IconButton,
	Portal,
	Select,
	useSlotRecipe,
} from "@chakra-ui/react";
import { LuPlus, LuRefreshCw, LuSave } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { useFitHeader } from "./hooks/useFitHeader";
import { fitHeaderRecipe } from "./recipes/fit-header.recipe";

const modelTypeCollection = createListCollection({
	items: [
		{ label: "Linear", value: "linear" },
		{ label: "Gaussian", value: "gaussian" },
	],
});

export default function FitHeader() {
	const {
		selectedType,
		setSelectedType,
		handleAdd,
		handleSync,
		handleSave,
		hasModels,
	} = useFitHeader();

	const recipe = useSlotRecipe({ recipe: fitHeaderRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.root}>
			<SectionHeader
				title="Model Fitting"
				tip="Build spectral models by combining linear and non-linear components."
				rightSlot={
					<HStack css={styles.controls}>
						<Select.Root
							collection={modelTypeCollection}
							size="xs"
							width="120px"
							value={selectedType}
							onValueChange={({ value }) => setSelectedType(value)}
						>
							<Select.HiddenSelect />
							<Select.Control css={styles.selectControl}>
								<Select.Trigger>
									<Select.ValueText placeholder="Type" />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content css={styles.selectContent}>
										{modelTypeCollection.items.map((item) => (
											<Select.Item
												key={item.value}
												item={item}
												css={styles.selectItem}
											>
												<Select.ItemText>{item.label}</Select.ItemText>
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</Portal>
						</Select.Root>

						<Button
							size="xs"
							variant="surface"
							colorPalette="cyan"
							css={styles.addButton}
							onClick={handleAdd}
						>
							<LuPlus />
							Add
						</Button>

						<Tooltip content="Sync models to current slice window">
							<IconButton
								aria-label="Sync models"
								size="xs"
								variant="ghost"
								css={styles.iconButton}
								onClick={handleSync}
								disabled={!hasModels}
							>
								<LuRefreshCw />
							</IconButton>
						</Tooltip>

						<Tooltip content="Save configuration">
							<IconButton
								aria-label="Save configuration"
								size="xs"
								variant="ghost"
								css={styles.iconButton}
								onClick={handleSave}
							>
								<LuSave />
							</IconButton>
						</Tooltip>
					</HStack>
				}
			/>
		</HStack>
	);
}
