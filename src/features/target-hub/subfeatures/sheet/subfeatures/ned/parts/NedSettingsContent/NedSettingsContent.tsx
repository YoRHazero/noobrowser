"use client";

import {
	Box,
	Button,
	HStack,
	NumberInput,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import { NED_RADIUS_UNIT_LABELS } from "../../shared/constants";
import type { NedRadiusUnit } from "../../shared/types";
import { getNedNextRadiusUnit } from "../../utils";
import { nedSettingsContentRecipe } from "./NedSettingsContent.recipe";

interface NedSettingsContentProps {
	draftValue: string;
	draftUnit: NedRadiusUnit;
	canSave: boolean;
	saveDisabledReason: string | null;
	canRefetch: boolean;
	refetchDisabledReason: string | null;
	onDraftValueChange: (value: string) => void;
	onDraftUnitChange: (unit: NedRadiusUnit) => void;
	onSave: () => void;
	onRefetch: () => void;
}

export function NedSettingsContent({
	draftValue,
	draftUnit,
	canSave,
	saveDisabledReason,
	canRefetch,
	refetchDisabledReason,
	onDraftValueChange,
	onDraftUnitChange,
	onSave,
	onRefetch,
}: NedSettingsContentProps) {
	const recipe = useSlotRecipe({ recipe: nedSettingsContentRecipe });
	const styles = recipe({
		feedbackTone:
			saveDisabledReason !== null || refetchDisabledReason !== null
				? "warning"
				: "default",
	});
	const nextUnit = getNedNextRadiusUnit(draftUnit);

	return (
		<Stack css={styles.root}>
			<Stack css={styles.field}>
				<Text css={styles.label}>Search radius</Text>
				<HStack css={styles.inputRow}>
					<NumberInput.Root
						size="sm"
						value={draftValue}
						min={0}
						onValueChange={({ value }) => onDraftValueChange(value)}
						css={styles.input}
					>
						<NumberInput.Input />
					</NumberInput.Root>

					<Tooltip
						content={`Change unit to ${NED_RADIUS_UNIT_LABELS[nextUnit]}`}
						showArrow
					>
						<Button
							type="button"
							size="sm"
							variant="outline"
							css={styles.unitButton}
							aria-label={`Change NED radius unit from ${draftUnit} to ${nextUnit}`}
							onClick={() => onDraftUnitChange(nextUnit)}
						>
							{NED_RADIUS_UNIT_LABELS[draftUnit]}
						</Button>
					</Tooltip>
				</HStack>
			</Stack>

			<Text css={styles.helper}>
				{saveDisabledReason ??
					refetchDisabledReason ??
					"Refetch uses the stored arcsecond radius."}
			</Text>

			<HStack css={styles.actions}>
				<Tooltip content={saveDisabledReason ?? "Save NED radius"} showArrow>
					<Box as="span" css={styles.actionWrap}>
						<Button
							type="button"
							size="sm"
							variant="ghost"
							css={styles.saveButton}
							disabled={!canSave}
							onClick={onSave}
						>
							Save
						</Button>
					</Box>
				</Tooltip>

				<Tooltip content={refetchDisabledReason ?? "Refetch NED"} showArrow>
					<Box as="span" css={styles.actionWrap}>
						<Button
							type="button"
							size="sm"
							variant="outline"
							css={styles.refetchButton}
							disabled={!canRefetch}
							onClick={onRefetch}
						>
							Refetch
						</Button>
					</Box>
				</Tooltip>
			</HStack>
		</Stack>
	);
}
