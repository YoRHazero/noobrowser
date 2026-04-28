import {
	Box,
	createListCollection,
	NumberInput,
	Portal,
	SegmentGroup,
	Select,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { Spectrum2DCanvasColorMap } from "@/canvas/spectrum2dCanvas";
import type {
	SpectrumWorkspaceDisplayNormKind,
	SpectrumWorkspaceDisplayRangeMode,
	SpectrumWorkspaceDisplaySampleSource,
} from "../../../../shared/types";
import {
	SPECTRUM_WORKSPACE_HUD_COLOR_MAP_OPTIONS,
	SPECTRUM_WORKSPACE_HUD_NORM_KIND_OPTIONS,
	SPECTRUM_WORKSPACE_HUD_RANGE_MODE_OPTIONS,
	SPECTRUM_WORKSPACE_HUD_SAMPLE_SOURCE_OPTIONS,
} from "../../shared/constants";
import { displayTabRecipe } from "./DisplayTab.recipe";

const colorMapCollection = createListCollection({
	items: SPECTRUM_WORKSPACE_HUD_COLOR_MAP_OPTIONS,
});

const normKindCollection = createListCollection({
	items: SPECTRUM_WORKSPACE_HUD_NORM_KIND_OPTIONS,
});

function formatNumericValue(value: number, fractionDigits: number): string {
	if (!Number.isFinite(value)) {
		return "";
	}

	return value.toFixed(fractionDigits).replace(/\.?0+$/, "");
}

function renderSegmentItems(
	items: readonly { value: string; label: string }[],
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>,
) {
	return items.map((item) => (
		<SegmentGroup.Item
			key={item.value}
			value={item.value}
			css={styles.segmentItem}
		>
			<SegmentGroup.ItemText css={styles.segmentItemText}>
				{item.label}
			</SegmentGroup.ItemText>
			<SegmentGroup.ItemHiddenInput />
		</SegmentGroup.Item>
	));
}

export interface DisplayTabProps {
	colorMap: Spectrum2DCanvasColorMap;
	normKind: SpectrumWorkspaceDisplayNormKind;
	rangeMode: SpectrumWorkspaceDisplayRangeMode;
	pmin: number;
	pmax: number;
	sampleSource: SpectrumWorkspaceDisplaySampleSource;
	vmin: number;
	vmax: number;
	onColorMapChange: (value: Spectrum2DCanvasColorMap) => void;
	onNormKindChange: (value: SpectrumWorkspaceDisplayNormKind) => void;
	onRangeModeChange: (value: SpectrumWorkspaceDisplayRangeMode) => void;
	onSampleSourceChange: (value: SpectrumWorkspaceDisplaySampleSource) => void;
	onPminChange: (value: number) => void;
	onPmaxChange: (value: number) => void;
	onVminChange: (value: number) => void;
	onVmaxChange: (value: number) => void;
}

export function DisplayTab({
	colorMap,
	normKind,
	rangeMode,
	pmin,
	pmax,
	sampleSource,
	vmin,
	vmax,
	onColorMapChange,
	onNormKindChange,
	onRangeModeChange,
	onSampleSourceChange,
	onPminChange,
	onPmaxChange,
	onVminChange,
	onVmaxChange,
}: DisplayTabProps) {
	const recipe = useSlotRecipe({ recipe: displayTabRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Mapping</Text>
				<Box css={styles.fieldGrid}>
					<Stack css={styles.field}>
						<Text css={styles.label}>Color Map</Text>
						<Select.Root
							collection={colorMapCollection}
							size="xs"
							value={[colorMap]}
							onValueChange={({ value }) => {
								const nextValue = value[0];
								if (
									nextValue === "gray" ||
									nextValue === "viridis" ||
									nextValue === "magma" ||
									nextValue === "plasma" ||
									nextValue === "inferno"
								) {
									onColorMapChange(nextValue);
								}
							}}
						>
							<Select.HiddenSelect />
							<Select.Control css={styles.selectControl}>
								<Select.Trigger>
									<Select.ValueText placeholder="Color map" />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content css={styles.selectContent}>
										{colorMapCollection.items.map((item) => (
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
					</Stack>

					<Stack css={styles.field}>
						<Text css={styles.label}>Norm Kind</Text>
						<Select.Root
							collection={normKindCollection}
							size="xs"
							value={[normKind]}
							onValueChange={({ value }) => {
								const nextValue = value[0];
								if (
									nextValue === "linear" ||
									nextValue === "log" ||
									nextValue === "asinh"
								) {
									onNormKindChange(nextValue);
								}
							}}
						>
							<Select.HiddenSelect />
							<Select.Control css={styles.selectControl}>
								<Select.Trigger>
									<Select.ValueText placeholder="Norm kind" />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<Portal>
								<Select.Positioner>
									<Select.Content css={styles.selectContent}>
										{normKindCollection.items.map((item) => (
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
					</Stack>
				</Box>
			</Stack>

			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Range</Text>
				<Stack css={styles.field}>
					<Text css={styles.label}>Range Mode</Text>
					<SegmentGroup.Root
						size="xs"
						css={styles.segmentRoot}
						value={rangeMode}
						onValueChange={({ value }) => {
							if (value === "percentile" || value === "absolute") {
								onRangeModeChange(value);
							}
						}}
					>
						<SegmentGroup.Indicator css={styles.segmentIndicator} />
						{renderSegmentItems(
							SPECTRUM_WORKSPACE_HUD_RANGE_MODE_OPTIONS,
							styles,
						)}
					</SegmentGroup.Root>
				</Stack>

				<Box css={styles.rangeDetails}>
					{rangeMode === "percentile" ? (
						<Stack gap={2}>
							<Box css={styles.fieldGrid}>
								<Stack css={styles.field}>
									<Text css={styles.label}>P Min</Text>
									<NumberInput.Root
										css={styles.numberInputRoot}
										size="xs"
										value={formatNumericValue(pmin, 1)}
										step={0.5}
										min={0}
										max={100}
										onValueChange={({ valueAsNumber }) => {
											if (!Number.isNaN(valueAsNumber)) {
												onPminChange(valueAsNumber);
											}
										}}
									>
										<NumberInput.Control />
										<NumberInput.Input css={styles.numberInput} />
									</NumberInput.Root>
								</Stack>

								<Stack css={styles.field}>
									<Text css={styles.label}>P Max</Text>
									<NumberInput.Root
										css={styles.numberInputRoot}
										size="xs"
										value={formatNumericValue(pmax, 1)}
										step={0.5}
										min={0}
										max={100}
										onValueChange={({ valueAsNumber }) => {
											if (!Number.isNaN(valueAsNumber)) {
												onPmaxChange(valueAsNumber);
											}
										}}
									>
										<NumberInput.Control />
										<NumberInput.Input css={styles.numberInput} />
									</NumberInput.Root>
								</Stack>
							</Box>

							<Stack css={styles.field}>
								<Text css={styles.label}>Sample Source</Text>
								<SegmentGroup.Root
									size="xs"
									css={styles.segmentRoot}
									value={sampleSource}
									onValueChange={({ value }) => {
										if (value === "window" || value === "full") {
											onSampleSourceChange(value);
										}
									}}
								>
									<SegmentGroup.Indicator css={styles.segmentIndicator} />
									{renderSegmentItems(
										SPECTRUM_WORKSPACE_HUD_SAMPLE_SOURCE_OPTIONS,
										styles,
									)}
								</SegmentGroup.Root>
							</Stack>
						</Stack>
					) : (
						<Box css={styles.fieldGrid}>
							<Stack css={styles.field}>
								<Text css={styles.label}>V Min</Text>
								<NumberInput.Root
									css={styles.numberInputRoot}
									size="xs"
									value={formatNumericValue(vmin, 4)}
									step={0.001}
									onValueChange={({ valueAsNumber }) => {
										if (!Number.isNaN(valueAsNumber)) {
											onVminChange(valueAsNumber);
										}
									}}
								>
									<NumberInput.Control />
									<NumberInput.Input css={styles.numberInput} />
								</NumberInput.Root>
							</Stack>

							<Stack css={styles.field}>
								<Text css={styles.label}>V Max</Text>
								<NumberInput.Root
									css={styles.numberInputRoot}
									size="xs"
									value={formatNumericValue(vmax, 4)}
									step={0.001}
									onValueChange={({ valueAsNumber }) => {
										if (!Number.isNaN(valueAsNumber)) {
											onVmaxChange(valueAsNumber);
										}
									}}
								>
									<NumberInput.Control />
									<NumberInput.Input css={styles.numberInput} />
								</NumberInput.Root>
							</Stack>
						</Box>
					)}
				</Box>
			</Stack>
		</Stack>
	);
}
