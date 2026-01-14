import {
	createListCollection,
	HStack,
	IconButton,
	Listbox,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { FitModel } from "@/stores/stores-types";
import { useFitModelTransferListBox } from "./hooks/useFitModelTransferListBox";
import { fitTransferListboxRecipe } from "./recipes/fit-transfer-listbox.recipe";

interface ModelOption {
	label: string;
	value: string;
	kind: string;
}

interface FitListBoxPanelProps {
	title: string;
	models: FitModel[];
	selectedValues: string[];
	onSelectedValuesChange: (values: string[]) => void;
}

export default function FitModelTransferListBox() {
	const {
		leftModels,
		rightModels,
		selectedLeft,
		selectedRight,
		setSelectedLeft,
		setSelectedRight,
		moveLeftToRight,
		moveRightToLeft,
	} = useFitModelTransferListBox();

	const recipe = useSlotRecipe({ recipe: fitTransferListboxRecipe });
	const styles = recipe();

	const FitListBoxPanel = ({
		title,
		models,
		selectedValues,
		onSelectedValuesChange,
	}: FitListBoxPanelProps) => {
		const collection = useMemo(() => {
			return createListCollection<ModelOption>({
				items: models.map((model) => ({
					label: model.name,
					value: String(model.id),
					kind: model.kind,
				})),
				itemToString: (item) => item.label,
				itemToValue: (item) => item.value,
				groupBy: (item) =>
					item.kind === "linear" ? "Linear Models" : "Gaussian Models",
			});
		}, [models]);

		return (
			<Listbox.Root
				collection={collection}
				selectionMode="multiple"
				value={selectedValues}
				onValueChange={(d) => onSelectedValuesChange(d.value)}
				css={styles.panel}
			>
				<Listbox.Label css={styles.label}>{title}</Listbox.Label>
				<Listbox.Content css={styles.content}>
					{collection.items.length > 0 ? (
						collection.group().map(([groupLabel, items]) => (
							<Listbox.ItemGroup key={groupLabel}>
								<Listbox.ItemGroupLabel css={styles.groupLabel}>
									{groupLabel}
								</Listbox.ItemGroupLabel>
								{items.map((item) => (
									<Listbox.Item key={item.value} item={item} css={styles.item}>
										<Listbox.ItemText fontSize="xs">
											{item.label}
										</Listbox.ItemText>
										<Listbox.ItemIndicator />
									</Listbox.Item>
								))}
							</Listbox.ItemGroup>
						))
					) : (
						<Stack css={styles.emptyState}>
							<Text css={styles.emptyText}>Empty</Text>
						</Stack>
					)}
				</Listbox.Content>
			</Listbox.Root>
		);
	};

	return (
		<HStack css={styles.root}>
			<FitListBoxPanel
				title="Model to draw"
				models={leftModels}
				selectedValues={selectedLeft}
				onSelectedValuesChange={setSelectedLeft}
			/>
			<Stack css={styles.transferControls}>
				<IconButton
					aria-label="Move to subtract"
					size="xs"
					variant="ghost"
					css={styles.moveButton}
					disabled={selectedLeft.length === 0}
					onClick={moveLeftToRight}
				>
					<LuChevronRight />
				</IconButton>
				<IconButton
					aria-label="Move to draw"
					size="xs"
					variant="ghost"
					css={styles.moveButton}
					disabled={selectedRight.length === 0}
					onClick={moveRightToLeft}
				>
					<LuChevronLeft />
				</IconButton>
			</Stack>
			<FitListBoxPanel
				title="Model to subtract"
				models={rightModels}
				selectedValues={selectedRight}
				onSelectedValuesChange={setSelectedRight}
			/>
		</HStack>
	);
}
