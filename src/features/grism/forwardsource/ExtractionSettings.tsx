import {
	Button,
	createListCollection,
	HStack,
	NumberInput,
	Portal,
	Select,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Activity } from "lucide-react";
import FitJobPoller from "../fitjob/FitJobPoller";
import GrismFitJobDrawer from "../fitjob/GrismFitJobDrawer";
import { SectionHeader } from "./components/SectionHeader";
import { useExtractionSettings } from "./hooks/useExtractionSettings";
import { extractionSettingsRecipe } from "./recipes/extraction-settings.recipe";

const extractModeCollection = createListCollection({
	items: [
		{ label: "GRISMR", value: "GRISMR" },
		{ label: "GRISMC", value: "GRISMC" },
	],
});

export default function ExtractionSettings() {
	const {
		fitApertureSize,
		fitExtractMode,
		setFitApertureSize,
		setFitExtractMode,
	} = useExtractionSettings();
	const recipe = useSlotRecipe({ recipe: extractionSettingsRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<FitJobPoller />
			<SectionHeader
				title="Extraction Settings"
				rightSlot={
					<GrismFitJobDrawer>
						<Button size="xs" variant="surface" colorPalette="cyan">
							<Activity size={12} style={{ marginRight: 4 }} /> Jobs
						</Button>
					</GrismFitJobDrawer>
				}
			/>

			<HStack css={styles.controls}>
				<Stack gap={0}>
					<Text css={styles.label}>Aperture (px)</Text>
					<NumberInput.Root
						size="xs"
						value={fitApertureSize.toString()}
						onValueChange={(details) =>
							setFitApertureSize(Number(details.value))
						}
						w="100px"
					>
						<NumberInput.Control css={styles.controlBase} />
						<NumberInput.Input css={styles.input} />
					</NumberInput.Root>
				</Stack>

				<Stack gap={0}>
					<Text css={styles.label}>Mode</Text>
					<Select.Root
						collection={extractModeCollection}
						size="xs"
						value={fitExtractMode}
						onValueChange={(details) => setFitExtractMode(details.value)}
						width="100px"
					>
						<Select.HiddenSelect />
						<Select.Control css={styles.controlBase}>
							<Select.Trigger>
								<Select.ValueText />
							</Select.Trigger>
						</Select.Control>
						<Portal>
							<Select.Positioner>
								<Select.Content css={styles.selectContent}>
									{extractModeCollection.items.map((item) => (
										<Select.Item
											item={item}
											key={item.value}
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
				</Stack>
			</HStack>
		</Stack>
	);
}
