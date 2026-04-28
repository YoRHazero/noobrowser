import {
	Box,
	NumberInput,
	Stack,
	Switch,
	type SystemStyleObject,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import type { SpectrumWorkspaceHudDraftFieldModel } from "../../hooks/useSpectrumWorkspaceHudExtractionDrafts";
import { extractionTabRecipe } from "./ExtractionTab.recipe";

export interface ExtractionTabProps {
	waveMinField: SpectrumWorkspaceHudDraftFieldModel;
	waveMaxField: SpectrumWorkspaceHudDraftFieldModel;
	spatialMinField: SpectrumWorkspaceHudDraftFieldModel;
	spatialMaxField: SpectrumWorkspaceHudDraftFieldModel;
	showWindow: boolean;
	showCenterLine: boolean;
	onShowWindowChange: (value: boolean) => void;
	onShowCenterLineChange: (value: boolean) => void;
}

function DraftNumberField({
	field,
	rootCss,
	inputCss,
	labelCss,
}: {
	field: SpectrumWorkspaceHudDraftFieldModel;
	rootCss: SystemStyleObject;
	inputCss: SystemStyleObject;
	labelCss: SystemStyleObject;
}) {
	return (
		<Stack gap={1}>
			<Text css={labelCss}>{field.label}</Text>
			<NumberInput.Root
				css={rootCss}
				size="xs"
				value={field.value}
				step={field.step}
				min={field.min}
				max={field.max}
				onValueChange={({ value }) => field.onChange(value)}
			>
				<NumberInput.Control />
				<NumberInput.Input
					css={inputCss}
					onBlur={field.onBlur}
					onKeyDown={field.onKeyDown}
				/>
			</NumberInput.Root>
		</Stack>
	);
}

export function ExtractionTab({
	waveMinField,
	waveMaxField,
	spatialMinField,
	spatialMaxField,
	showWindow,
	showCenterLine,
	onShowWindowChange,
	onShowCenterLineChange,
}: ExtractionTabProps) {
	const recipe = useSlotRecipe({ recipe: extractionTabRecipe });
	const styles = recipe();

	return (
		<Stack css={styles.root}>
			<Text css={styles.sectionTitle}>Window</Text>
			<Box css={styles.fieldGrid}>
				<DraftNumberField
					field={waveMinField}
					rootCss={styles.numberInputRoot}
					inputCss={styles.numberInput}
					labelCss={styles.label}
				/>
				<DraftNumberField
					field={waveMaxField}
					rootCss={styles.numberInputRoot}
					inputCss={styles.numberInput}
					labelCss={styles.label}
				/>
				<DraftNumberField
					field={spatialMinField}
					rootCss={styles.numberInputRoot}
					inputCss={styles.numberInput}
					labelCss={styles.label}
				/>
				<DraftNumberField
					field={spatialMaxField}
					rootCss={styles.numberInputRoot}
					inputCss={styles.numberInput}
					labelCss={styles.label}
				/>
			</Box>

			<Text css={styles.sectionTitle}>Guides</Text>
			<Box css={styles.toggleGrid}>
				<Stack css={styles.toggleRow}>
					<Text css={styles.toggleLabel}>Show Window</Text>
					<Switch.Root
						size="sm"
						checked={showWindow}
						onCheckedChange={({ checked }) => onShowWindowChange(checked)}
					>
						<Switch.HiddenInput />
						<Switch.Control css={styles.switchControl}>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</Stack>

				<Stack css={styles.toggleRow}>
					<Text css={styles.toggleLabel}>Show Center Line</Text>
					<Switch.Root
						size="sm"
						checked={showCenterLine}
						onCheckedChange={({ checked }) => onShowCenterLineChange(checked)}
					>
						<Switch.HiddenInput />
						<Switch.Control css={styles.switchControl}>
							<Switch.Thumb />
						</Switch.Control>
					</Switch.Root>
				</Stack>
			</Box>
		</Stack>
	);
}
