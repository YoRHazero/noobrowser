import { HStack, NumberInput, Text } from "@chakra-ui/react";

interface CompactNumberInputProps {
	label: string;
	value: number;
	onChange: (value: number) => void;
	step?: number;
	min?: number;
	max?: number;
	decimalScale?: number;
	labelWidth?: string;
	inputWidth?: string;
	onBlur?: () => void;
	disabled?: boolean;
}

export function CompactNumberInput(props: CompactNumberInputProps) {
	const {
		label,
		value,
		onChange,
		step = 1,
		min,
		max,
		decimalScale = 4,
		labelWidth = "36px",
		inputWidth = "120px",
		onBlur,
		disabled,
	} = props;

	const displayValue = Number.isFinite(value)
		? value.toFixed(decimalScale).replace(/\.?0+$/, "")
		: "";

	return (
		<HStack gap={3} align="center">
			<Text textStyle="sm" minW={labelWidth} color="fg.muted">
				{label}
			</Text>
			<NumberInput.Root
				size="xs"
				maxW={inputWidth}
				value={displayValue}
				step={step}
				min={min}
				max={max}
				disabled={disabled}
				onValueChange={({ valueAsNumber }) => {
					// Chakra v3 sometimes returns NaN on empty; handle safely
					if (!Number.isNaN(valueAsNumber)) {
						onChange(valueAsNumber);
					}
				}}
			>
				<NumberInput.Control />
				<NumberInput.Input onBlur={onBlur} />
			</NumberInput.Root>
		</HStack>
	);
}