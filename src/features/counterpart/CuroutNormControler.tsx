import { Box, Field, NumberInput, Stack } from "@chakra-ui/react";
import { useShallow } from "zustand/react/shallow";
import { NormPercentageInput } from "@/components/ui/custom-component";
import { Slider } from "@/components/ui/slider";
import { useCounterpartStore } from "@/stores/image";
import { percentileFromSortedArray } from "@/utils/plot";
import { clamp } from "@/utils/projection";

export default function CuroutNormControler() {
	const { cutoutNorm, setCutoutNorm, cutoutSortedArray } = useCounterpartStore(
		useShallow((state) => ({
			cutoutNorm: state.cutoutNorm,
			setCutoutNorm: state.setCutoutNorm,
			cutoutSortedArray: state.cutoutSortedArray,
		})),
	);
	const handleCutoutPminChange = (next: number) => {
		const maxAllowedCutoutPmin = cutoutNorm.pmax - 5;
		const clampedValue = clamp(next, 0, maxAllowedCutoutPmin);
		if (cutoutSortedArray) {
			const newVmin = percentileFromSortedArray(
				cutoutSortedArray,
				clampedValue,
				true,
			) as number;
			setCutoutNorm({ pmin: clampedValue, vmin: newVmin });
		} else {
			setCutoutNorm({ pmin: clampedValue, vmin: undefined });
		}
	};
	const handleCutoutPmaxChange = (next: number) => {
		const minAllowedCutoutPmax = cutoutNorm.pmin + 5;
		const clampedValue = clamp(next, minAllowedCutoutPmax, 100);
		if (cutoutSortedArray) {
			const newVmax = percentileFromSortedArray(
				cutoutSortedArray,
				clampedValue,
				true,
			) as number;
			setCutoutNorm({ pmax: clampedValue, vmax: newVmax });
		} else {
			setCutoutNorm({ pmax: clampedValue, vmax: undefined });
		}
	};
	const marks = [
		{ value: 0, label: "0%" },
		{ value: 25, label: "25%" },
		{ value: 50, label: "50%" },
		{ value: 75, label: "75%" },
		{ value: 100, label: "100%" },
	];
	const handleSliderChange = (details: { value: number[] }) => {
		const [newPmin, newPmax] = details.value;
		handleCutoutPminChange(newPmin);
		handleCutoutPmaxChange(newPmax);
	};
	return (
		<Stack gap={2} h={"600px"} w={"80px"}>
			<NormValueInput
				label="Vmax"
				value={cutoutNorm.vmax}
				onValueChange={(value: number) => setCutoutNorm({ vmax: value })}
			/>
			<NormPercentageInput
				label="Pmax (%)"
				value={cutoutNorm.pmax}
				onValueChange={handleCutoutPmaxChange}
			/>
			<Box flex={"1"} display={"flex"} justifyContent={"center"}>
				<Slider
					orientation={"vertical"}
					value={[cutoutNorm.pmin, cutoutNorm.pmax]}
					onValueChange={handleSliderChange}
					size="sm"
					h="100%"
					step={0.1}
					min={0}
					max={100}
					marks={marks}
				/>
			</Box>
			<NormPercentageInput
				label="Pmin (%)"
				value={cutoutNorm.pmin}
				onValueChange={handleCutoutPminChange}
			/>
			<NormValueInput
				label="Vmin"
				value={cutoutNorm.vmin}
				onValueChange={(value: number) => setCutoutNorm({ vmin: value })}
			/>
		</Stack>
	);
}

function NormValueInput({
	label,
	value,
	onValueChange,
	width,
}: {
	label: string;
	value: number | undefined;
	onValueChange: (value: number) => void;
	width?: string;
}) {
	return (
		<Field.Root>
			<Field.Label>{label}</Field.Label>
			<NumberInput.Root
				size="sm"
				step={0.01}
				value={value !== undefined ? String(value) : ""}
				onValueChange={(details) => {
					onValueChange(details.valueAsNumber);
				}}
				allowMouseWheel
				width={width ?? "100%"}
			>
				<NumberInput.Control />
				<NumberInput.Input />
			</NumberInput.Root>
		</Field.Root>
	);
}
