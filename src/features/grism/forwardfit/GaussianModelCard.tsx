import { Stack, Text } from "@chakra-ui/react";
import { CompactNumberInput } from "@/components/ui/compact-number-input";
import type { FitGaussianModel } from "@/stores/stores-types";
import ModelCardShell from "./components/ModelCardShell";
import { useGaussianModelCard } from "./hooks/useGaussianModelCard";

interface GaussianModelCardProps {
	model: FitGaussianModel;
}

export default function GaussianModelCard(props: GaussianModelCardProps) {
	const { model } = props;
	const {
		name,
		color,
		active,
		values,
		display,
		steps,
		stepControls,
		fwhmDisplay,
		handleA,
		handleMu,
		handleSigma,
		handleX1,
		handleX2,
		handleColorChange,
		handleRename,
		handleToggle,
		handleRemove,
		clampMinOnBlur,
		clampMaxOnBlur,
	} = useGaussianModelCard(model);

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
			formula={<Text>y = A·exp(−(x−μ)²/2σ²) &nbsp; (x1 &lt; x &lt; x2)</Text>}
		>
			<Stack gap={1}>
				<CompactNumberInput
					label="A"
					value={values.amplitude}
					step={steps.A}
					onChange={handleA}
					decimalScale={6}
				/>
				<Stack direction="row" gap={2}>
					<CompactNumberInput
						label="μ"
						value={display.mu}
						step={steps.mu}
						onChange={handleMu}
					/>
					<CompactNumberInput
						label="σ"
						value={display.sigma}
						step={steps.sigma}
						onChange={handleSigma}
					/>
				</Stack>
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

				<Text textStyle="xs" color="fg.muted">
					FWHM ~ {fwhmDisplay.value} {fwhmDisplay.unit} ({fwhmDisplay.velocity}{" "}
					km/s)
				</Text>
			</Stack>
		</ModelCardShell>
	);
}
