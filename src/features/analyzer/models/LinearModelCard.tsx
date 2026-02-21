import { Stack, Text } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type { FitLinearModel } from "@/stores/stores-types";
import ModelCardShell from "./components/ModelCardShell";
import { useLinearModelCard } from "./hooks/useLinearModelCard";

interface LinearModelCardProps {
	model: FitLinearModel;
}

export default function LinearModelCard(props: LinearModelCardProps) {
	const { model } = props;
	const {
		name,
		color,
		active,
		values,
		display,
		steps,
		stepControls,
		handleK,
		handleB,
		handleX0,
		handleX1,
		handleX2,
		handleColorChange,
		handleRename,
		handleToggle,
		handleRemove,
		clampMinOnBlur,
		clampMaxOnBlur,
	} = useLinearModelCard(model);

	return (
		<ModelCardShell
			name={name}
			onRename={handleRename}
			color={color}
			onColorChange={handleColorChange}
			active={active}
			onToggleActive={handleToggle}
			onRemove={handleRemove}
			stepControls={stepControls}
			formula={<Text>y = k(x - x0) + b &nbsp; (x1 &lt; x &lt; x2)</Text>}
		>
			<Stack gap={1}>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="k"
						value={values.k}
						step={steps.k}
						onChange={handleK}
						decimalScale={6}
					/>
					<CompactNumberInput
						label="b"
						value={values.b}
						step={steps.b}
						onChange={handleB}
						decimalScale={6}
					/>
				</Stack>
				<CompactNumberInput
					label="x0"
					value={display.x0}
					step={steps.x0}
					onChange={handleX0}
				/>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="x1"
						value={display.x1}
						step={steps.range}
						onChange={handleX1}
						onBlur={clampMinOnBlur}
					/>
					<CompactNumberInput
						label="x2"
						value={display.x2}
						step={steps.range}
						onChange={handleX2}
						onBlur={clampMaxOnBlur}
					/>
				</Stack>
			</Stack>
		</ModelCardShell>
	);
}
