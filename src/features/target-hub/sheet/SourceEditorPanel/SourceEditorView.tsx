import type { SystemStyleObject } from "@chakra-ui/react";
import {
	Box,
	Button,
	createListCollection,
	HStack,
	IconButton,
	Input,
	NumberInput,
	Popover,
	Portal,
	Select,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import {
	ArrowLeft,
	ChartSpline,
	Crosshair,
	Plus,
	RefreshCw,
	Settings2,
} from "lucide-react";
import { DarkMode } from "@/components/ui/color-mode";
import { Tooltip } from "@/components/ui/tooltip";
import { TargetHubSourceProjectionControls } from "../components/TargetHubSourceProjectionControls";
import { sheetRecipe } from "../recipes/sheet.recipe";

const NO_FOOTPRINT_VALUE = "__unassigned__";
const SOURCE_ACTION_ICON_SIZE = 14;

interface FootprintCollectionItem {
	label: string;
	value: string;
	tooltip: string | null;
}

interface SourceEditorViewProps {
	header: {
		isDetail: boolean;
		canReturn: boolean;
		canSubmit: boolean;
		onEnterCreateMode: () => void;
		onReturnToDetailMode: () => void;
		onCreateSource: () => void;
	};
	identity: {
		isDetail: boolean;
		labelValue: string;
		idValue: string;
		draftLabel: string;
		onLabelChange: (value: string) => void;
	};
	skyPosition: {
		isDetail: boolean;
		raValue: string;
		decValue: string;
		draftRa: string;
		draftDec: string;
		onRaChange: (value: string) => void;
		onDecChange: (value: string) => void;
	};
	imagePosition: {
		xValue: string;
		yValue: string;
		canResolveXY: boolean;
		isResolvingXY: boolean;
		onResolveXY: () => Promise<void> | void;
	};
	footprint: {
		value: string | null;
		options: Array<{
			label: string;
			value: string;
			tooltip: string | null;
		}>;
		canSyncCurrentFootprint: boolean;
		onChange: (refBasename: string | null) => void;
		onSyncCurrentFootprint: () => void;
	};
	extraction: {
		isSettingsOpen: boolean;
		apertureSize: string;
		waveMinUm: string;
		waveMaxUm: string;
		canSave: boolean;
		saveDisabledReason: string | null;
		onOpenChange: (open: boolean) => void;
		onApertureSizeChange: (value: string) => void;
		onWaveMinUmChange: (value: string) => void;
		onWaveMaxUmChange: (value: string) => void;
		onSave: () => void;
		onReset: () => void;
	};
	spectrum: {
		canFetch: boolean;
		fetchDisabledReason: string | null;
		onFetch: () => void;
	};
	actions: {
		overviewVisible: boolean;
		inspectorVisible: boolean;
		onToggleOverview: () => void;
		onToggleInspector: () => void;
	};
}

export function SourceEditorView({
	header,
	identity,
	skyPosition,
	imagePosition,
	footprint,
	extraction,
	spectrum,
	actions,
}: SourceEditorViewProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
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
	const actionsJustify = header.isDetail ? "space-between" : "flex-end";
	const hasFootprintOptions = footprint.options.length > 0;
	const footprintDisplayValue = footprint.value ?? "Unassigned";

	return (
		<Stack css={styles.currentCard}>
			<HStack css={styles.editorHeader}>
				<Box>
					<Text fontSize="sm" fontWeight="semibold" color="white">
						{header.isDetail ? "Current Source" : "Create Source"}
					</Text>
				</Box>

				<HStack css={styles.editorHeaderActions}>
					{header.canReturn ? (
						<Button
							type="button"
							size="xs"
							variant="ghost"
							onClick={header.onReturnToDetailMode}
						>
							<ArrowLeft size={14} />
							Back
						</Button>
					) : null}
					{header.isDetail ? (
						<Button
							type="button"
							size="xs"
							variant="outline"
							onClick={header.onEnterCreateMode}
						>
							<Plus size={14} />
							New
						</Button>
					) : null}
				</HStack>
			</HStack>

			<Box css={styles.editorRow}>
				<EditorField label="ID">
					<ReadonlyFieldValue
						value={identity.idValue}
						color={identity.isDetail ? "white" : "whiteAlpha.720"}
					/>
				</EditorField>
				<EditorField label="Label">
					{identity.isDetail ? (
						<ReadonlyFieldValue
							value={identity.labelValue || "—"}
							color="white"
						/>
					) : (
						<Input
							aria-label="Source label"
							value={identity.draftLabel}
							placeholder="Optional"
							css={styles.editableField}
							onChange={(event) => identity.onLabelChange(event.target.value)}
						/>
					)}
				</EditorField>
			</Box>

			<Box css={styles.editorRow}>
				<EditorField label="RA">
					{skyPosition.isDetail ? (
						<Box css={styles.readonlyField}>
							<Text color="white">{skyPosition.raValue}</Text>
						</Box>
					) : (
						<NumberInput.Root
							size="sm"
							w="full"
							value={skyPosition.draftRa}
							onValueChange={(details) => skyPosition.onRaChange(details.value)}
						>
							<NumberInput.Input
								aria-label="Source RA"
								css={styles.editableField}
							/>
						</NumberInput.Root>
					)}
				</EditorField>
				<EditorField label="Dec">
					{skyPosition.isDetail ? (
						<Box css={styles.readonlyField}>
							<Text color="white">{skyPosition.decValue}</Text>
						</Box>
					) : (
						<NumberInput.Root
							size="sm"
							w="full"
							value={skyPosition.draftDec}
							onValueChange={(details) =>
								skyPosition.onDecChange(details.value)
							}
						>
							<NumberInput.Input
								aria-label="Source Dec"
								css={styles.editableField}
							/>
						</NumberInput.Root>
					)}
				</EditorField>
			</Box>

			<HStack align="center" gap={2} w="full">
				<EditorField label="Footprint" flex="1">
					<Box flex="1" minW={0} w="full">
						{hasFootprintOptions ? (
							<Select.Root
								collection={footprintCollection}
								size="sm"
								positioning={{
									placement: "bottom-start",
									sameWidth: true,
									offset: { mainAxis: 6, crossAxis: 0 },
								}}
								value={
									footprint.value ? [footprint.value] : [NO_FOOTPRINT_VALUE]
								}
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
											<Select.Content
												bg="rgba(9, 15, 28, 0.98)"
												borderColor="whiteAlpha.200"
												zIndex={1600}
											>
												{footprintCollection.items.map((item) => (
													<Select.Item item={item} key={item.value}>
														<Tooltip
															content={item.tooltip ?? item.label}
															disabled={
																!item.tooltip ||
																item.value === NO_FOOTPRINT_VALUE
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
							<Box css={styles.readonlyField}>
								<Text color="whiteAlpha.820">{footprintDisplayValue}</Text>
							</Box>
						)}
					</Box>
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
						disabled={
							!imagePosition.canResolveXY || imagePosition.isResolvingXY
						}
						loading={imagePosition.isResolvingXY}
						onClick={imagePosition.onResolveXY}
					>
						<Crosshair size={15} />
					</IconButton>
				</Tooltip>
			</HStack>

			<Box css={styles.editorRow}>
				<EditorField label="X">
					<Box css={styles.readonlyField}>
						<Text color="whiteAlpha.820">{imagePosition.xValue}</Text>
					</Box>
				</EditorField>
				<EditorField label="Y">
					<Box css={styles.readonlyField}>
						<Text color="whiteAlpha.820">{imagePosition.yValue}</Text>
					</Box>
				</EditorField>
			</Box>

			<HStack
				css={{
					...styles.editorActions,
					justifyContent: actionsJustify,
				}}
			>
				{header.isDetail ? (
					<>
						<TargetHubSourceProjectionControls
							isOverviewVisible={actions.overviewVisible}
							isInspectorVisible={actions.inspectorVisible}
							onToggleOverview={actions.onToggleOverview}
							onToggleInspector={actions.onToggleInspector}
						/>

						<HStack css={styles.chipGroup}>
							<Popover.Root
								open={extraction.isSettingsOpen}
								onOpenChange={(details) =>
									extraction.onOpenChange(details.open)
								}
								positioning={{
									placement: "top-end",
									offset: { mainAxis: 10, crossAxis: 0 },
								}}
							>
								<Popover.Trigger asChild>
									<Tooltip content="Extraction settings" showArrow>
										<IconButton
											type="button"
											aria-label="Spectrum Extraction Settings"
											size="sm"
											variant="ghost"
											css={styles.chip}
										>
											<Settings2 size={SOURCE_ACTION_ICON_SIZE} />
										</IconButton>
									</Tooltip>
								</Popover.Trigger>
								<Portal>
									<DarkMode>
										<Popover.Positioner>
											<Popover.Content
												w="240px"
												borderColor="whiteAlpha.180"
												bg="rgba(9, 15, 28, 0.98)"
												boxShadow="0 18px 42px rgba(2, 8, 23, 0.48)"
											>
												<Popover.Arrow bg="rgba(9, 15, 28, 0.98)" />
												<Popover.Body p={3}>
													<Stack gap={3}>
														<Text
															fontSize="xs"
															fontWeight="semibold"
															letterSpacing="normal"
															textTransform="none"
															color="white"
														>
															Extraction settings
														</Text>

														<ExtractionDraftField
															label="Aperture (px)"
															value={extraction.apertureSize}
															step={1}
															min={0}
															onChange={extraction.onApertureSizeChange}
														/>
														<ExtractionDraftField
															label="Wave min (um)"
															value={extraction.waveMinUm}
															step={0.1}
															min={0}
															onChange={extraction.onWaveMinUmChange}
														/>
														<ExtractionDraftField
															label="Wave max (um)"
															value={extraction.waveMaxUm}
															step={0.1}
															min={0}
															onChange={extraction.onWaveMaxUmChange}
														/>

														<Text
															fontSize="xs"
															color={
																extraction.canSave
																	? "whiteAlpha.660"
																	: "orange.200"
															}
															lineHeight={1.5}
															minH="18px"
														>
															{extraction.saveDisabledReason ??
																"Changes apply after you save."}
														</Text>

														<HStack justify="flex-end" gap={2}>
															<Button
																type="button"
																size="sm"
																variant="ghost"
																color="whiteAlpha.860"
																textTransform="none"
																onClick={extraction.onReset}
															>
																Reset
															</Button>
															<Button
																type="button"
																size="sm"
																variant="outline"
																borderColor="whiteAlpha.220"
																color="white"
																textTransform="none"
																disabled={!extraction.canSave}
																onClick={extraction.onSave}
															>
																Save
															</Button>
														</HStack>
													</Stack>
												</Popover.Body>
											</Popover.Content>
										</Popover.Positioner>
									</DarkMode>
								</Portal>
							</Popover.Root>

							<Tooltip
								content={spectrum.fetchDisabledReason ?? "Fetch spectrum"}
								showArrow
							>
								<IconButton
									type="button"
									aria-label="Fetch Spectrum"
									size="sm"
									variant="ghost"
									css={createChipStyles(styles.chip, spectrum.canFetch)}
									disabled={!spectrum.canFetch}
									onClick={spectrum.onFetch}
								>
									<ChartSpline size={SOURCE_ACTION_ICON_SIZE} />
								</IconButton>
							</Tooltip>
						</HStack>
					</>
				) : (
					<Tooltip content="Create source" showArrow>
						<IconButton
							type="button"
							aria-label="Create Source"
							size="sm"
							variant="ghost"
							css={createChipStyles(styles.chip, header.canSubmit)}
							disabled={!header.canSubmit}
							onClick={header.onCreateSource}
						>
							<Plus size={SOURCE_ACTION_ICON_SIZE} />
						</IconButton>
					</Tooltip>
				)}
			</HStack>
		</Stack>
	);
}

interface EditorFieldProps {
	label: string;
	children: React.ReactNode;
	flex?: string;
}

function EditorField({ label, children, flex = "1" }: EditorFieldProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<HStack css={styles.inlineField} flex={flex}>
			<Text css={styles.inlineFieldLabel}>{label}</Text>
			<Box minW={0} w="full">
				{children}
			</Box>
		</HStack>
	);
}

interface ReadonlyFieldValueProps {
	value: string;
	color: string;
}

function ReadonlyFieldValue({ value, color }: ReadonlyFieldValueProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();
	const shouldShowTooltip = value !== "—" && value.trim().length > 0;

	const content = (
		<Box css={styles.readonlyField} minW={0}>
			<Text
				color={color}
				w="full"
				minW={0}
				overflow="hidden"
				textOverflow="ellipsis"
				whiteSpace="nowrap"
			>
				{value}
			</Text>
		</Box>
	);

	if (!shouldShowTooltip) {
		return content;
	}

	return (
		<Tooltip content={value} showArrow>
			{content}
		</Tooltip>
	);
}

interface ExtractionDraftFieldProps {
	label: string;
	value: string;
	step: number;
	min?: number;
	onChange: (value: string) => void;
}

function ExtractionDraftField({
	label,
	value,
	step,
	min,
	onChange,
}: ExtractionDraftFieldProps) {
	const recipe = useSlotRecipe({ recipe: sheetRecipe });
	const styles = recipe();

	return (
		<Stack gap={1.5}>
			<Text
				fontSize="11px"
				fontWeight="medium"
				letterSpacing="normal"
				textTransform="none"
				color="whiteAlpha.720"
			>
				{label}
			</Text>
			<NumberInput.Root
				size="sm"
				value={value}
				step={step}
				min={min}
				onValueChange={({ value }) => onChange(value)}
			>
				<NumberInput.Input css={styles.editableField} />
			</NumberInput.Root>
		</Stack>
	);
}

function createChipStyles(baseCss: SystemStyleObject, enabled: boolean) {
	return {
		...baseCss,
		borderColor: enabled ? "cyan.300" : baseCss.borderColor,
		bg: enabled ? "rgba(34, 211, 238, 0.16)" : baseCss.bg,
		color: enabled ? "white" : baseCss.color,
		boxShadow: enabled ? "0 0 0 1px rgba(34, 211, 238, 0.22)" : undefined,
	};
}
