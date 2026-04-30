"use client";

import {
	Box,
	createListCollection,
	IconButton,
	type ListCollection,
	NumberInput,
	Portal,
	SegmentGroup,
	Select,
	Stack,
	Switch,
	type SystemStyleObject,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import {
	IMAGE_INSPECTOR_BASE_LAYER_COLOR_MAP_OPTIONS,
	IMAGE_INSPECTOR_BASE_LAYER_RANGE_MODE_OPTIONS,
	IMAGE_INSPECTOR_BASE_LAYER_STRETCH_OPTIONS,
} from "../../../../shared/constants";
import type {
	BaseLayerColorMap,
	BaseLayerNormRangeMode,
	BaseLayerStretch,
} from "../../../../shared/types";
import { baseLayerRecipe } from "./BaseLayer.recipe";
import { type BaseLayerViewModel, useBaseLayer } from "./useBaseLayer";

interface SelectOption {
	label: string;
	value: string;
}

function isBaseLayerColorMap(value: string): value is BaseLayerColorMap {
	return (
		value === "gray" ||
		value === "viridis" ||
		value === "magma" ||
		value === "plasma" ||
		value === "inferno"
	);
}

function isBaseLayerRangeMode(value: string): value is BaseLayerNormRangeMode {
	return value === "percentile" || value === "absolute";
}

function isBaseLayerStretch(value: string): value is BaseLayerStretch {
	return (
		value === "linear" ||
		value === "sqrt" ||
		value === "log" ||
		value === "asinh"
	);
}

function getRangeLabels(rangeMode: BaseLayerNormRangeMode) {
	return rangeMode === "percentile"
		? { min: "pmin", max: "pmax" }
		: { min: "vmin", max: "vmax" };
}

function renderRangeModeControl({
	value,
	onChange,
	styles,
}: {
	value: BaseLayerNormRangeMode;
	onChange: (rangeMode: BaseLayerNormRangeMode) => void;
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
}) {
	return (
		<SegmentGroup.Root
			size="xs"
			css={styles.segmentRoot}
			value={value}
			onValueChange={({ value }) => {
				if (value && isBaseLayerRangeMode(value)) {
					onChange(value);
				}
			}}
		>
			<SegmentGroup.Indicator css={styles.segmentIndicator} />
			{IMAGE_INSPECTOR_BASE_LAYER_RANGE_MODE_OPTIONS.map((mode) => (
				<SegmentGroup.Item
					key={mode.value}
					value={mode.value}
					css={styles.segmentItem}
				>
					<SegmentGroup.ItemText css={styles.segmentItemText}>
						{mode.label}
					</SegmentGroup.ItemText>
					<SegmentGroup.ItemHiddenInput />
				</SegmentGroup.Item>
			))}
		</SegmentGroup.Root>
	);
}

function NumberField({
	label,
	value,
	onChange,
	styles,
}: {
	label: string;
	value: number;
	onChange: (value: number) => void;
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
}) {
	return (
		<Stack gap={1}>
			<Text css={styles.label}>{label}</Text>
			<NumberInput.Root
				size="xs"
				value={String(value)}
				css={styles.numberRoot}
				onValueChange={({ valueAsNumber }) => {
					if (!Number.isNaN(valueAsNumber)) {
						onChange(valueAsNumber);
					}
				}}
			>
				<NumberInput.Control />
				<NumberInput.Input css={styles.numberInput} />
			</NumberInput.Root>
		</Stack>
	);
}

function StretchSelect({
	value,
	onChange,
	styles,
	collection,
}: {
	value: BaseLayerStretch;
	onChange: (value: BaseLayerStretch) => void;
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
	collection: ListCollection<SelectOption>;
}) {
	return (
		<Stack gap={1}>
			<Text css={styles.label}>stretch</Text>
			<Select.Root
				collection={collection}
				size="xs"
				value={[value]}
				onValueChange={({ value }) => {
					const nextValue = value[0];
					if (nextValue && isBaseLayerStretch(nextValue)) {
						onChange(nextValue);
					}
				}}
			>
				<Select.HiddenSelect />
				<Select.Control css={styles.selectControl}>
					<Select.Trigger>
						<Select.ValueText />
						<Select.Indicator />
					</Select.Trigger>
				</Select.Control>
				<SelectPortal styles={styles} collection={collection} />
			</Select.Root>
		</Stack>
	);
}

function SelectPortal({
	styles,
	collection,
}: {
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
	collection: ListCollection<SelectOption>;
}) {
	return (
		<Portal>
			<Select.Positioner>
				<Select.Content css={styles.selectContent}>
					{collection.items.map((item) => (
						<Select.Item
							key={String(item.value)}
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
	);
}

function NormRow({
	norm,
	onMinChange,
	onMaxChange,
	onStretchChange,
	styles,
	stretchCollection,
}: {
	norm: BaseLayerViewModel["mainCanvas"]["norm"];
	onMinChange: (value: number) => void;
	onMaxChange: (value: number) => void;
	onStretchChange: (value: BaseLayerStretch) => void;
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
	stretchCollection: ListCollection<SelectOption>;
}) {
	const labels = getRangeLabels(norm.rangeMode);

	return (
		<Box css={styles.controlRow}>
			<NumberField
				label={labels.min}
				value={norm.min}
				onChange={onMinChange}
				styles={styles}
			/>
			<NumberField
				label={labels.max}
				value={norm.max}
				onChange={onMaxChange}
				styles={styles}
			/>
			<StretchSelect
				value={norm.stretch}
				onChange={onStretchChange}
				styles={styles}
				collection={stretchCollection}
			/>
		</Box>
	);
}

export function BaseLayer() {
	const recipe = useSlotRecipe({ recipe: baseLayerRecipe });
	const styles = recipe();
	const baseLayer = useBaseLayer();
	const buttonDisabled = baseLayer.downloadDisabledReason !== null;
	const basenameCollection = useMemo(
		() =>
			createListCollection<SelectOption>({
				items: baseLayer.basenameOptions.map((basename) => ({
					label: basename,
					value: basename,
				})),
			}),
		[baseLayer.basenameOptions],
	);
	const colorMapCollection = useMemo(
		() =>
			createListCollection<SelectOption>({
				items: [...IMAGE_INSPECTOR_BASE_LAYER_COLOR_MAP_OPTIONS],
			}),
		[],
	);
	const stretchCollection = useMemo(
		() =>
			createListCollection<SelectOption>({
				items: [...IMAGE_INSPECTOR_BASE_LAYER_STRETCH_OPTIONS],
			}),
		[],
	);
	const controlLabelStyle = styles.label as SystemStyleObject;

	return (
		<Stack css={styles.root}>
			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Grism</Text>
				<Box css={styles.grismRow}>
					<Stack gap={1} minW={0}>
						<Text css={styles.label}>current ID</Text>
						<Box css={styles.readonlyField}>
							<Text css={styles.value}>{baseLayer.footprintId}</Text>
						</Box>
					</Stack>

					<Stack gap={1} minW={0}>
						<Text css={styles.label}>basename</Text>
						<Box css={styles.basenameSelectTrigger}>
							<Select.Root
								collection={basenameCollection}
								size="xs"
								value={
									baseLayer.activeBasename ? [baseLayer.activeBasename] : []
								}
								onValueChange={({ value }) => {
									const nextValue = value[0];
									if (nextValue) {
										baseLayer.onBasenameChange(nextValue);
									}
								}}
							>
								<Select.HiddenSelect />
								<Select.Control css={styles.selectControl}>
									<Select.Trigger>
										<Select.ValueText
											placeholder="basename"
											css={styles.selectValueText}
										/>
										<Select.Indicator />
									</Select.Trigger>
								</Select.Control>
								<SelectPortal styles={styles} collection={basenameCollection} />
							</Select.Root>
						</Box>
					</Stack>

					<Tooltip
						content={
							baseLayer.downloadDisabledReason ?? "Fetch all grism images"
						}
						showArrow
					>
						<Box css={styles.fetchButtonTrigger}>
							<IconButton
								aria-label="Fetch grism images"
								size="sm"
								colorPalette="cyan"
								css={styles.fetchButton}
								disabled={buttonDisabled}
								loading={baseLayer.isFetchingImages}
								onClick={baseLayer.onDownloadGrismImages}
							>
								<Download />
							</IconButton>
						</Box>
					</Tooltip>
				</Box>
				{baseLayer.errorMessage ? (
					<Text css={styles.error}>{baseLayer.errorMessage}</Text>
				) : null}
			</Stack>

			<Stack css={styles.section}>
				<Text css={styles.sectionTitle}>Main Canvas</Text>
				<Box css={styles.controlGrid}>
					<Stack gap={1} minW={0}>
						<Text css={styles.label}>cmap</Text>
						<Select.Root
							collection={colorMapCollection}
							size="xs"
							value={[baseLayer.mainCanvas.colorMap]}
							onValueChange={({ value }) => {
								const nextValue = value[0];
								if (nextValue && isBaseLayerColorMap(nextValue)) {
									baseLayer.mainCanvas.onColorMapChange(nextValue);
								}
							}}
						>
							<Select.HiddenSelect />
							<Select.Control css={styles.selectControl}>
								<Select.Trigger>
									<Select.ValueText />
									<Select.Indicator />
								</Select.Trigger>
							</Select.Control>
							<SelectPortal styles={styles} collection={colorMapCollection} />
						</Select.Root>
					</Stack>

					<Stack gap={1} minW={0}>
						<Text css={controlLabelStyle}>range mode</Text>
						{renderRangeModeControl({
							value: baseLayer.mainCanvas.norm.rangeMode,
							onChange: baseLayer.mainCanvas.onRangeModeChange,
							styles,
						})}
					</Stack>
				</Box>

				<NormRow
					norm={baseLayer.mainCanvas.norm}
					onMinChange={baseLayer.mainCanvas.onMinChange}
					onMaxChange={baseLayer.mainCanvas.onMaxChange}
					onStretchChange={baseLayer.mainCanvas.onStretchChange}
					styles={styles}
					stretchCollection={stretchCollection}
				/>
			</Stack>

			<Stack css={styles.section}>
				<Box css={styles.sectionHeader}>
					<Text css={styles.sectionTitle}>ROI Canvas</Text>
					<Tooltip content="Independent ROI norm" showArrow>
						<Box as="span" css={styles.switchTrigger}>
							<Switch.Root
								size="sm"
								checked={baseLayer.roiCanvas.independentNorm}
								aria-label="Independent ROI norm"
								onCheckedChange={({ checked }) =>
									baseLayer.roiCanvas.onIndependentNormChange(checked)
								}
							>
								<Switch.HiddenInput />
								<Switch.Control css={styles.switchControl}>
									<Switch.Thumb />
								</Switch.Control>
							</Switch.Root>
						</Box>
					</Tooltip>
				</Box>

				{baseLayer.roiCanvas.independentNorm ? (
					<Box css={styles.controlGrid}>
						<Stack gap={1} minW={0}>
							<Text css={controlLabelStyle}>range mode</Text>
							{renderRangeModeControl({
								value: baseLayer.roiCanvas.norm.rangeMode,
								onChange: baseLayer.roiCanvas.onRangeModeChange,
								styles,
							})}
						</Stack>
					</Box>
				) : null}

				{baseLayer.roiCanvas.independentNorm ? (
					<NormRow
						norm={baseLayer.roiCanvas.norm}
						onMinChange={baseLayer.roiCanvas.onMinChange}
						onMaxChange={baseLayer.roiCanvas.onMaxChange}
						onStretchChange={baseLayer.roiCanvas.onStretchChange}
						styles={styles}
						stretchCollection={stretchCollection}
					/>
				) : null}
			</Stack>
		</Stack>
	);
}
