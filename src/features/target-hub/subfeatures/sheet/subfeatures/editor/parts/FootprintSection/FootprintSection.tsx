import {
	createListCollection,
	HStack,
	IconButton,
	Portal,
	Select,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Crosshair, RefreshCw } from "lucide-react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import type {
	EditorFootprintModel,
	EditorImagePositionModel,
} from "../../shared/types";
import { EditorField } from "../EditorField";
import { ReadonlyFieldValue } from "../ReadonlyFieldValue";
import { footprintSectionRecipe } from "./FootprintSection.recipe";

const NO_FOOTPRINT_VALUE = "__unassigned__";

interface FootprintCollectionItem {
	label: string;
	value: string;
	tooltip: string | null;
}

interface FootprintSectionProps {
	footprint: EditorFootprintModel;
	imagePosition: EditorImagePositionModel;
}

export function FootprintSection({
	footprint,
	imagePosition,
}: FootprintSectionProps) {
	const recipe = useSlotRecipe({ recipe: footprintSectionRecipe });
	const styles = recipe();
	const footprintCollection = createListCollection<FootprintCollectionItem>({
		items: [
			{ label: "Unassigned", value: NO_FOOTPRINT_VALUE, tooltip: null },
			...footprint.options.map((option) => ({
				label: option.label,
				value: option.value,
				tooltip: option.tooltip,
			})),
		],
	});
	const hasFootprintOptions = footprint.options.length > 0;
	const footprintDisplayValue = footprint.value ?? "Unassigned";

	return (
		<HStack css={styles.editorRow}>
			<EditorField label="Footprint" flex="1">
				{hasFootprintOptions ? (
					<Select.Root
						collection={footprintCollection}
						size="sm"
						css={styles.selectRoot}
						positioning={{
							placement: "bottom-start",
							sameWidth: true,
							offset: { mainAxis: 6, crossAxis: 0 },
						}}
						value={footprint.value ? [footprint.value] : [NO_FOOTPRINT_VALUE]}
						onValueChange={(details) => {
							const nextValue = details.value[0];
							footprint.onChange(
								!nextValue || nextValue === NO_FOOTPRINT_VALUE
									? null
									: nextValue,
							);
						}}
					>
						<Select.HiddenSelect />
						<Select.Control css={styles.editableField}>
							<Select.Trigger>
								<Select.ValueText placeholder="Unassigned" />
							</Select.Trigger>
						</Select.Control>
						<Portal>
							<DarkMode>
								<Select.Positioner>
									<Select.Content css={styles.selectContent}>
										{footprintCollection.items.map((item) => (
											<Select.Item item={item} key={item.value}>
												<Tooltip
													content={item.tooltip ?? item.label}
													disabled={
														!item.tooltip || item.value === NO_FOOTPRINT_VALUE
													}
													showArrow
												>
													<Select.ItemText>{item.label}</Select.ItemText>
												</Tooltip>
												<Select.ItemIndicator />
											</Select.Item>
										))}
									</Select.Content>
								</Select.Positioner>
							</DarkMode>
						</Portal>
					</Select.Root>
				) : (
					<ReadonlyFieldValue value={footprintDisplayValue} tone="muted" />
				)}
			</EditorField>

			<Tooltip content="Sync current footprint" showArrow>
				<IconButton
					type="button"
					aria-label="Sync Current Footprint"
					size="sm"
					variant="ghost"
					css={styles.chip}
					disabled={!footprint.canSyncCurrentFootprint}
					onClick={footprint.onSyncCurrentFootprint}
				>
					<RefreshCw size={15} />
				</IconButton>
			</Tooltip>
			<Tooltip content="Resolve X/Y" showArrow>
				<IconButton
					type="button"
					aria-label="Resolve X Y"
					size="sm"
					variant="ghost"
					css={styles.chip}
					disabled={!imagePosition.canResolveXY || imagePosition.isResolvingXY}
					loading={imagePosition.isResolvingXY}
					onClick={imagePosition.onResolveXY}
				>
					<Crosshair size={15} />
				</IconButton>
			</Tooltip>
		</HStack>
	);
}
