import {
	Box,
	Button,
	ButtonGroup,
	Field,
	IconButton,
	NumberInput,
	Popover,
	Portal,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Send, Settings2 } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import type {
	FitJobActionBarModel,
	FitJobExtractMode,
	FitJobSettingsModel,
} from "../../hooks/lineFitModels";
import { fitJobActionBarRecipe } from "./FitJobActionBar.recipe";

function FitJobSettingsPopover({
	settings,
	styles,
}: {
	settings: FitJobSettingsModel;
	styles: ReturnType<ReturnType<typeof useSlotRecipe>>;
}) {
	const modeOptions: FitJobExtractMode[] = ["GRISMR", "GRISMC"];

	return (
		<Popover.Root lazyMount unmountOnExit positioning={{ placement: "bottom-end" }}>
			<Popover.Trigger asChild>
				<IconButton
					aria-label="MCMC job settings"
					title="MCMC job settings"
					size="xs"
					variant="outline"
					colorPalette="gray"
					css={styles.iconButton}
				>
					<Settings2 size={13} />
				</IconButton>
			</Popover.Trigger>
			<Portal>
				<Popover.Positioner>
					<Popover.Content css={styles.popoverContent}>
						<Popover.Arrow />
						<Popover.Header css={styles.popoverHeader}>
							<Popover.Title css={styles.popoverTitle}>
								MCMC job settings
							</Popover.Title>
							<Button
								size="2xs"
								variant="ghost"
								colorPalette="gray"
								css={styles.resetButton}
								onClick={settings.onReset}
							>
								Reset
							</Button>
						</Popover.Header>
						<Popover.Body css={styles.popoverBody}>
							<Box css={styles.fieldGrid}>
								<Field.Root css={styles.fieldRoot} invalid={settings.offsetInvalid}>
									<Field.Label css={styles.fieldLabel}>Offset</Field.Label>
									<NumberInput.Root
										size="xs"
										value={settings.offsetValue}
										step={1}
										onValueChange={({ value }) =>
											settings.onOffsetChange(value)
										}
									>
										<NumberInput.Control />
										<NumberInput.Input
											aria-label="MCMC extraction offset"
											onBlur={settings.onOffsetBlur}
										/>
									</NumberInput.Root>
									<Field.ErrorText>Enter a finite number.</Field.ErrorText>
								</Field.Root>

								<Field.Root
									css={styles.fieldRoot}
									invalid={settings.apertureSizeInvalid}
								>
									<Field.Label css={styles.fieldLabel}>Aperture</Field.Label>
									<NumberInput.Root
										size="xs"
										value={settings.apertureSizeValue}
										step={1}
										min={0}
										onValueChange={({ value }) =>
											settings.onApertureSizeChange(value)
										}
									>
										<NumberInput.Control />
										<NumberInput.Input
											aria-label="MCMC aperture size"
											onBlur={settings.onApertureSizeBlur}
										/>
									</NumberInput.Root>
									<Field.ErrorText>Enter a positive number.</Field.ErrorText>
								</Field.Root>

								<Field.Root css={styles.modeFieldRoot}>
									<Field.Label css={styles.fieldLabel}>Extract mode</Field.Label>
									<ButtonGroup
										attached
										size="xs"
										variant="outline"
										css={styles.modeGroup}
									>
										{modeOptions.map((mode) => (
											<Button
												key={mode}
												type="button"
												colorPalette={
													settings.extractMode === mode ? "cyan" : "gray"
												}
												variant={
													settings.extractMode === mode ? "surface" : "outline"
												}
												onClick={() => settings.onExtractModeChange(mode)}
											>
												{mode}
											</Button>
										))}
									</ButtonGroup>
								</Field.Root>
							</Box>
						</Popover.Body>
					</Popover.Content>
				</Popover.Positioner>
			</Portal>
		</Popover.Root>
	);
}

export function FitJobActionBar({
	statusLabel,
	detailLabel,
	canSubmit,
	isSubmitting,
	tooltip,
	onSubmit,
	jobSettings,
}: FitJobActionBarModel) {
	const recipe = useSlotRecipe({ recipe: fitJobActionBarRecipe });
	const styles = recipe({ ready: canSubmit });

	return (
		<Box css={styles.root}>
			<Box css={styles.meta}>
				<Text css={styles.badge}>MCMC</Text>
				<Stack gap={0} minW={0}>
					<Text css={styles.statusText}>{statusLabel}</Text>
					<Text css={styles.detailText}>{detailLabel}</Text>
				</Stack>
			</Box>

			<Box css={styles.actionGroup}>
				<FitJobSettingsPopover settings={jobSettings} styles={styles} />
				<Tooltip content={tooltip}>
					<Box css={styles.submitWrap}>
						<IconButton
							aria-label="Submit MCMC job"
							size="xs"
							colorPalette="cyan"
							variant="outline"
							css={styles.iconButton}
							disabled={!canSubmit || isSubmitting}
							loading={isSubmitting}
							onClick={onSubmit}
						>
							<Send size={13} />
						</IconButton>
					</Box>
				</Tooltip>
			</Box>
		</Box>
	);
}
