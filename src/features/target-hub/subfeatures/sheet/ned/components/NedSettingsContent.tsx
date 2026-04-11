import {
	Box,
	Button,
	HStack,
	NumberInput,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";
import type { NedRadiusUnit } from "../useNed";

const UNIT_LABELS: Record<NedRadiusUnit, string> = {
	degree: "°",
	arcminute: "′",
	arcsecond: "″",
};

const UNIT_SEQUENCE: NedRadiusUnit[] = ["arcsecond", "arcminute", "degree"];

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
	const nextUnit = getNextUnit(draftUnit);

	return (
		<Stack gap={3}>
			<Stack gap={1}>
				<Text
					fontSize="11px"
					fontWeight="medium"
					letterSpacing="normal"
					textTransform="none"
					color="whiteAlpha.720"
				>
					Search radius
				</Text>
				<HStack align="stretch" gap={2}>
					<NumberInput.Root
						size="sm"
						value={draftValue}
						min={0}
						onValueChange={({ value }) => onDraftValueChange(value)}
						flex="1"
					>
						<NumberInput.Input />
					</NumberInput.Root>

					<Tooltip
						content={`Change unit to ${UNIT_LABELS[nextUnit]}`}
						showArrow
					>
						<Button
							type="button"
							size="sm"
							variant="outline"
							borderColor="whiteAlpha.220"
							color="white"
							minW="48px"
							aria-label={`Change NED radius unit from ${draftUnit} to ${nextUnit}`}
							onClick={() => onDraftUnitChange(nextUnit)}
						>
							{UNIT_LABELS[draftUnit]}
						</Button>
					</Tooltip>
				</HStack>
			</Stack>

			<Text
				fontSize="xs"
				lineHeight={1.5}
				minH="18px"
				color={canSave ? "whiteAlpha.720" : "orange.200"}
			>
				{saveDisabledReason ??
					refetchDisabledReason ??
					"Refetch uses the stored arcsecond radius."}
			</Text>

			<HStack justify="flex-end" gap={2}>
				<Tooltip content={saveDisabledReason ?? "Save NED radius"} showArrow>
					<Box as="span" display="inline-flex">
						<Button
							type="button"
							size="sm"
							variant="ghost"
							color="whiteAlpha.860"
							textTransform="none"
							disabled={!canSave}
							onClick={onSave}
						>
							Save
						</Button>
					</Box>
				</Tooltip>

				<Tooltip content={refetchDisabledReason ?? "Refetch NED"} showArrow>
					<Box as="span" display="inline-flex">
						<Button
							type="button"
							size="sm"
							variant="outline"
							borderColor="whiteAlpha.220"
							color="white"
							textTransform="none"
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

function getNextUnit(unit: NedRadiusUnit): NedRadiusUnit {
	const currentIndex = UNIT_SEQUENCE.indexOf(unit);
	return UNIT_SEQUENCE[(currentIndex + 1) % UNIT_SEQUENCE.length];
}
