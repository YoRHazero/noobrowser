import {
	Badge,
	Box,
	HStack,
	NumberInput,
	SegmentGroup,
	Stack,
	Switch,
	Tabs,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import type {
	LineFitPriorDrawerEditorModel,
	LineFitPriorDrawerPriorType,
	LineFitPriorDrawerReferenceOptionModel,
} from "../../hooks/lineFitPriorDrawerModels";
import { priorDrawerRecipe } from "./PriorDrawer.recipe";

const PRIOR_TYPE_OPTIONS: {
	value: LineFitPriorDrawerPriorType;
	label: string;
}[] = [
	{ value: "Default", label: "Default" },
	{ value: "Normal", label: "Normal" },
	{ value: "TruncatedNormal", label: "Truncated" },
	{ value: "Uniform", label: "Uniform" },
	{ value: "Fixed", label: "Fixed" },
	{ value: "Deterministic", label: "Link" },
];

function NumberField({
	label,
	value,
	unitLabel,
	onChange,
}: {
	label: string;
	value: string;
	unitLabel?: string | null;
	onChange: (value: string) => void;
}) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.field}>
			<Text css={styles.fieldLabel}>{label}</Text>
			<HStack gap={2}>
				<NumberInput.Root
					size="xs"
					value={value}
					css={styles.numberInput}
					onValueChange={({ value: nextValue }) => onChange(nextValue)}
				>
					<NumberInput.Input />
				</NumberInput.Root>
				{unitLabel ? <Text css={styles.unitText}>{unitLabel}</Text> : null}
			</HStack>
		</Stack>
	);
}

function DeterministicModeField({
	value,
	onChange,
}: {
	value: string;
	onChange: (value: string) => void;
}) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.field}>
			<Text css={styles.fieldLabel}>Mode</Text>
			<SegmentGroup.Root
				size="sm"
				value={value}
				css={styles.modeGroup}
				onValueChange={(details) => onChange(details.value ?? "add")}
			>
				<SegmentGroup.Indicator />
				<SegmentGroup.Item value="add">
					<SegmentGroup.ItemText>+</SegmentGroup.ItemText>
					<SegmentGroup.ItemHiddenInput />
				</SegmentGroup.Item>
				<SegmentGroup.Item value="multiply">
					<SegmentGroup.ItemText>x</SegmentGroup.ItemText>
					<SegmentGroup.ItemHiddenInput />
				</SegmentGroup.Item>
			</SegmentGroup.Root>
		</Stack>
	);
}

function SigmaVelocityToggle({
	useVelocity,
	onUseVelocityChange,
}: {
	useVelocity: boolean;
	onUseVelocityChange: (useVelocity: boolean) => void;
}) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Tooltip content="Edit sigma prior values as FWHM velocity in km/s">
			<HStack css={styles.velocityToggle}>
				<Text css={styles.velocityToggleLabel}>FWHM km/s</Text>
				<Switch.Root
					size="xs"
					colorPalette="teal"
					checked={useVelocity}
					onCheckedChange={(details) => onUseVelocityChange(details.checked)}
				>
					<Switch.HiddenInput />
					<Switch.Control>
						<Switch.Thumb />
					</Switch.Control>
				</Switch.Root>
			</HStack>
		</Tooltip>
	);
}

function getReferenceModelId(value: string): number | null {
	const [modelIdText] = value.split(":");
	const modelId = Number.parseInt(modelIdText ?? "", 10);
	return Number.isFinite(modelId) ? modelId : null;
}

function getReferenceModelOptions(
	referenceOptions: readonly LineFitPriorDrawerReferenceOptionModel[],
): { modelId: number; modelName: string }[] {
	const modelOptionsById = new Map<
		number,
		{ modelId: number; modelName: string }
	>();
	for (const option of referenceOptions) {
		modelOptionsById.set(option.modelId, {
			modelId: option.modelId,
			modelName: option.modelName,
		});
	}

	return [...modelOptionsById.values()];
}

function DeterministicReferenceField({
	currentModelName,
	currentParamLabel,
	mode,
	value,
	referenceValue,
	referenceOptions,
	onReferenceChange,
}: {
	currentModelName: string;
	currentParamLabel: string;
	mode: string;
	value: string;
	referenceValue: string;
	referenceOptions: readonly LineFitPriorDrawerReferenceOptionModel[];
	onReferenceChange: (value: string) => void;
}) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();
	const selectedReferenceModelId = getReferenceModelId(referenceValue);
	const referenceModelOptions = getReferenceModelOptions(referenceOptions);
	const referenceParamOptions = referenceOptions.filter(
		(option) => option.modelId === selectedReferenceModelId,
	);
	const selectedReference = referenceOptions.find(
		(option) => option.value === referenceValue,
	);
	const operation = mode === "multiply" ? "x" : "+";

	return (
		<Stack gap={3}>
			<Box css={styles.referenceGrid}>
				<Stack css={styles.referenceColumn}>
					<Box css={styles.selectionHeader}>
						<Text css={styles.selectionTitle}>Reference model</Text>
					</Box>
					<Stack css={styles.referenceContent}>
						{referenceModelOptions.length === 0 ? (
							<Stack css={styles.selectionEmpty}>No reference</Stack>
						) : (
							referenceModelOptions.map((option) => {
								const rowStyles = recipe({
									selected: selectedReferenceModelId === option.modelId,
								});

								return (
									<Box
										key={option.modelId}
										as="button"
										css={rowStyles.selectionRow}
										onClick={() =>
											onReferenceChange(
												referenceOptions.find(
													(referenceOption) =>
														referenceOption.modelId === option.modelId,
												)?.value ?? "",
											)
										}
									>
										<Stack css={rowStyles.selectionText}>
											<Text css={rowStyles.selectionName}>
												{option.modelName}
											</Text>
										</Stack>
									</Box>
								);
							})
						)}
					</Stack>
				</Stack>

				<Stack css={styles.referenceColumn}>
					<Box css={styles.selectionHeader}>
						<Text css={styles.selectionTitle}>Reference parameter</Text>
					</Box>
					<Stack css={styles.referenceContent}>
						{referenceParamOptions.length === 0 ? (
							<Stack css={styles.selectionEmpty}>Select a model</Stack>
						) : (
							referenceParamOptions.map((option) => {
								const rowStyles = recipe({
									selected: referenceValue === option.value,
								});

								return (
									<Box
										key={option.value}
										as="button"
										css={rowStyles.selectionRow}
										onClick={() => onReferenceChange(option.value)}
									>
										<Stack css={rowStyles.selectionText}>
											<Text css={rowStyles.selectionName}>
												{option.paramLabel}
											</Text>
										</Stack>
									</Box>
								);
							})
						)}
					</Stack>
				</Stack>
			</Box>
			<HStack css={styles.previewRow}>
				<Badge size="sm" variant="subtle">
					Preview
				</Badge>
				<Text css={styles.previewText}>
					{selectedReference
						? `${currentParamLabel}@${currentModelName} = ${selectedReference.paramLabel}@${selectedReference.modelName} ${operation} ${value || "0"}`
						: "Select a reference parameter."}
				</Text>
			</HStack>
		</Stack>
	);
}

function PriorTabPanel({
	value,
	canUseVelocity,
	useVelocity,
	onUseVelocityChange,
	children,
}: {
	value: LineFitPriorDrawerPriorType;
	canUseVelocity: boolean;
	useVelocity: boolean;
	onUseVelocityChange: (useVelocity: boolean) => void;
	children: ReactNode;
}) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Tabs.Content value={value} css={styles.tabsPanel}>
			{canUseVelocity ? (
				<SigmaVelocityToggle
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				/>
			) : null}
			{children}
		</Tabs.Content>
	);
}

export function PriorParameterEditor({
	modelName,
	paramLabel,
	currentValue,
	unitLabel,
	type,
	draft,
	referenceOptions,
	canUseVelocity,
	useVelocity,
	validationError,
	onTypeChange,
	onDraftChange,
	onUseVelocityChange,
}: LineFitPriorDrawerEditorModel) {
	const recipe = useSlotRecipe({ recipe: priorDrawerRecipe });
	const styles = recipe();

	return (
		<Stack gap={0}>
			<Stack css={styles.editorHeader}>
				<Text css={styles.editorTitle}>{paramLabel}</Text>
				<Text css={styles.editorSubtitle}>
					{modelName} / current {currentValue}
					{unitLabel ? ` ${unitLabel}` : ""}
				</Text>
			</Stack>

			<Tabs.Root
				value={type}
				size="sm"
				variant="enclosed"
				fitted
				css={styles.tabsRoot}
				onValueChange={(details) =>
					onTypeChange(details.value as LineFitPriorDrawerPriorType)
				}
			>
				<Tabs.List css={styles.tabsList}>
					{PRIOR_TYPE_OPTIONS.map((option) => (
						<Tabs.Trigger
							key={option.value}
							value={option.value}
							css={styles.tabsTrigger}
						>
							{option.label}
						</Tabs.Trigger>
					))}
				</Tabs.List>

				<Tabs.Content value="Default" css={styles.tabsPanel}>
					<Stack css={styles.editorEmpty}>
						This parameter is using the default prior.
					</Stack>
				</Tabs.Content>

				<PriorTabPanel
					value="Fixed"
					canUseVelocity={canUseVelocity}
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				>
					<Box css={styles.fieldGrid}>
						<NumberField
							label="Value"
							value={draft.value ?? ""}
							unitLabel={unitLabel}
							onChange={(value) => onDraftChange("value", value)}
						/>
					</Box>
				</PriorTabPanel>

				<PriorTabPanel
					value="Normal"
					canUseVelocity={canUseVelocity}
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				>
					<Box css={styles.fieldGrid}>
						<NumberField
							label="mu"
							value={draft.mu ?? ""}
							unitLabel={unitLabel}
							onChange={(value) => onDraftChange("mu", value)}
						/>
						<NumberField
							label="sigma"
							value={draft.sigma ?? ""}
							unitLabel={unitLabel}
							onChange={(value) => onDraftChange("sigma", value)}
						/>
					</Box>
				</PriorTabPanel>

				<PriorTabPanel
					value="Uniform"
					canUseVelocity={canUseVelocity}
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				>
					<Box css={styles.fieldGrid}>
						<NumberField
							label="Lower"
							value={draft.lower ?? ""}
							unitLabel={unitLabel}
							onChange={(value) => onDraftChange("lower", value)}
						/>
						<NumberField
							label="Upper"
							value={draft.upper ?? ""}
							unitLabel={unitLabel}
							onChange={(value) => onDraftChange("upper", value)}
						/>
					</Box>
				</PriorTabPanel>

				<PriorTabPanel
					value="TruncatedNormal"
					canUseVelocity={canUseVelocity}
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				>
					<Stack gap={3}>
						<Box css={styles.fieldGrid}>
							<NumberField
								label="mu"
								value={draft.mu ?? ""}
								unitLabel={unitLabel}
								onChange={(value) => onDraftChange("mu", value)}
							/>
							<NumberField
								label="sigma"
								value={draft.sigma ?? ""}
								unitLabel={unitLabel}
								onChange={(value) => onDraftChange("sigma", value)}
							/>
						</Box>
						<Box css={styles.fieldGrid}>
							<NumberField
								label="Lower"
								value={draft.lower ?? ""}
								unitLabel={unitLabel}
								onChange={(value) => onDraftChange("lower", value)}
							/>
							<NumberField
								label="Upper"
								value={draft.upper ?? ""}
								unitLabel={unitLabel}
								onChange={(value) => onDraftChange("upper", value)}
							/>
						</Box>
					</Stack>
				</PriorTabPanel>

				<PriorTabPanel
					value="Deterministic"
					canUseVelocity={canUseVelocity}
					useVelocity={useVelocity}
					onUseVelocityChange={onUseVelocityChange}
				>
					<Stack gap={3}>
						<Box css={styles.fieldGrid}>
							<DeterministicModeField
								value={draft.mode ?? "add"}
								onChange={(value) => onDraftChange("mode", value)}
							/>
							<NumberField
								label="Value"
								value={draft.value ?? ""}
								unitLabel={draft.mode === "multiply" ? null : unitLabel}
								onChange={(value) => onDraftChange("value", value)}
							/>
						</Box>
						<DeterministicReferenceField
							currentModelName={modelName}
							currentParamLabel={paramLabel}
							mode={draft.mode ?? "add"}
							value={draft.value ?? ""}
							referenceValue={draft.reference ?? ""}
							referenceOptions={referenceOptions}
							onReferenceChange={(value) => onDraftChange("reference", value)}
						/>
					</Stack>
				</PriorTabPanel>

				{validationError ? (
					<Text css={styles.errorText}>{validationError}</Text>
				) : null}
			</Tabs.Root>
		</Stack>
	);
}
