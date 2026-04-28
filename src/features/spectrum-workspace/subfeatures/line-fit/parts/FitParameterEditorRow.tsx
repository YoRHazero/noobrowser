import { HStack, IconButton, NumberInput, Text } from "@chakra-ui/react";
import { Check, X } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export type FitModelParameterKey =
	| "amplitude"
	| "muUm"
	| "sigmaUm"
	| "fwhmKmS"
	| "rangeMinUm"
	| "rangeMaxUm"
	| "k"
	| "b"
	| "x0Um";

const PARAMETER_LABELS: Record<FitModelParameterKey, string> = {
	amplitude: "A",
	muUm: "mu",
	sigmaUm: "sigma",
	fwhmKmS: "FWHM",
	rangeMinUm: "x1",
	rangeMaxUm: "x2",
	k: "k",
	b: "b",
	x0Um: "x0",
};

export interface FitParameterEditorRowProps {
	parameterKey: FitModelParameterKey;
	value: string;
	unitLabel?: string;
	onValueChange: (value: string) => void;
	onCommit: () => void;
	onCancel: () => void;
}

export function FitParameterEditorRow({
	parameterKey,
	value,
	unitLabel,
	onValueChange,
	onCommit,
	onCancel,
}: FitParameterEditorRowProps) {
	return (
		<HStack
			gap={2}
			w="full"
			px={2}
			py={2}
			borderWidth="1px"
			borderColor="border.muted"
			borderRadius="md"
			bg="bg.subtle"
		>
			<Text
				fontSize="2xs"
				fontWeight="semibold"
				color="fg.muted"
				minW="2.75rem"
			>
				{PARAMETER_LABELS[parameterKey]}
			</Text>
			<NumberInput.Root
				size="xs"
				value={value}
				flex="1"
				minW={0}
				onValueChange={({ value: nextValue }) => onValueChange(nextValue)}
			>
				<NumberInput.Input
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							onCommit();
						}
						if (event.key === "Escape") {
							onCancel();
						}
					}}
				/>
			</NumberInput.Root>
			{unitLabel ? (
				<Text fontSize="2xs" color="fg.subtle" minW="2.25rem">
					{unitLabel}
				</Text>
			) : null}
			<Tooltip content="Apply parameter value">
				<IconButton
					aria-label="Apply parameter value"
					size="2xs"
					variant="ghost"
					disabled={value.trim().length === 0}
					onClick={onCommit}
				>
					<Check size={13} />
				</IconButton>
			</Tooltip>
			<Tooltip content="Cancel parameter edit">
				<IconButton
					aria-label="Cancel parameter edit"
					size="2xs"
					variant="ghost"
					onClick={onCancel}
				>
					<X size={13} />
				</IconButton>
			</Tooltip>
		</HStack>
	);
}
