import { Button, Wrap } from "@chakra-ui/react";
import type { Spectrum1DCanvasLinearFitModel } from "@/canvas/spectrum1dCanvas";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import { formatLineFitNumber, toLineFitDisplayWavelength } from "../utils";
import type { FitModelParameterKey } from "./FitParameterEditorRow";

interface ParameterButtonProps {
	label: string;
	value: string;
	onClick: () => void;
}

function ParameterButton({ label, value, onClick }: ParameterButtonProps) {
	return (
		<Button
			size="2xs"
			variant="subtle"
			fontVariantNumeric="tabular-nums"
			onClick={onClick}
		>
			{label}={value}
		</Button>
	);
}

export function LinearParameterDisplay({
	model,
	display,
	onStartEdit,
}: {
	model: Spectrum1DCanvasLinearFitModel;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
	onStartEdit: (key: FitModelParameterKey, value: string) => void;
}) {
	const wavelengthDigits = display.wavelengthUnit === "um" ? 4 : 1;
	const x0 = toLineFitDisplayWavelength(model.x0Um, display);
	const rangeMin = toLineFitDisplayWavelength(model.range.minUm, display);
	const rangeMax = toLineFitDisplayWavelength(model.range.maxUm, display);

	return (
		<Wrap gap={1}>
			<ParameterButton
				label="k"
				value={formatLineFitNumber(model.k, 3)}
				onClick={() => onStartEdit("k", formatLineFitNumber(model.k, 6))}
			/>
			<ParameterButton
				label="b"
				value={formatLineFitNumber(model.b, 3)}
				onClick={() => onStartEdit("b", formatLineFitNumber(model.b, 6))}
			/>
			<ParameterButton
				label="x0"
				value={formatLineFitNumber(x0, wavelengthDigits)}
				onClick={() => onStartEdit("x0Um", formatLineFitNumber(x0, 8))}
			/>
			<ParameterButton
				label="x1"
				value={formatLineFitNumber(rangeMin, wavelengthDigits)}
				onClick={() =>
					onStartEdit("rangeMinUm", formatLineFitNumber(rangeMin, 8))
				}
			/>
			<ParameterButton
				label="x2"
				value={formatLineFitNumber(rangeMax, wavelengthDigits)}
				onClick={() =>
					onStartEdit("rangeMaxUm", formatLineFitNumber(rangeMax, 8))
				}
			/>
		</Wrap>
	);
}
