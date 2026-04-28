import { Button, Wrap } from "@chakra-ui/react";
import type { Spectrum1DCanvasGaussianFitModel } from "@/canvas/spectrum1dCanvas";
import type { SpectrumWorkspaceWavelengthDisplayState } from "../../../shared/types";
import {
	formatLineFitNumber,
	sigmaUmToFwhmKmS,
	toLineFitDisplayWavelength,
} from "../utils";
import type { FitModelParameterKey } from "./FitParameterEditorRow";

interface ParameterButtonProps {
	label: string;
	value: string;
	disabled?: boolean;
	onClick: () => void;
}

function ParameterButton({
	label,
	value,
	disabled,
	onClick,
}: ParameterButtonProps) {
	return (
		<Button
			size="2xs"
			variant="subtle"
			disabled={disabled}
			fontVariantNumeric="tabular-nums"
			onClick={onClick}
		>
			{label}={value}
		</Button>
	);
}

export function GaussianParameterDisplay({
	model,
	display,
	onStartEdit,
}: {
	model: Spectrum1DCanvasGaussianFitModel;
	display: Pick<
		SpectrumWorkspaceWavelengthDisplayState,
		"redshift" | "wavelengthFrame" | "wavelengthUnit"
	>;
	onStartEdit: (key: FitModelParameterKey, value: string) => void;
}) {
	const wavelengthDigits = display.wavelengthUnit === "um" ? 4 : 1;
	const mu = toLineFitDisplayWavelength(model.muUm, display);
	const sigma = toLineFitDisplayWavelength(model.sigmaUm, display);
	const rangeMin = toLineFitDisplayWavelength(model.range.minUm, display);
	const rangeMax = toLineFitDisplayWavelength(model.range.maxUm, display);
	const fwhmKmS = sigmaUmToFwhmKmS(model.muUm, model.sigmaUm);
	const fwhmValue = formatLineFitNumber(fwhmKmS, 1);

	return (
		<Wrap gap={1}>
			<ParameterButton
				label="A"
				value={formatLineFitNumber(model.amplitude, 3)}
				onClick={() =>
					onStartEdit("amplitude", formatLineFitNumber(model.amplitude, 6))
				}
			/>
			<ParameterButton
				label="mu"
				value={formatLineFitNumber(mu, wavelengthDigits)}
				onClick={() => onStartEdit("muUm", formatLineFitNumber(mu, 8))}
			/>
			<ParameterButton
				label="sigma"
				value={formatLineFitNumber(sigma, wavelengthDigits)}
				onClick={() => onStartEdit("sigmaUm", formatLineFitNumber(sigma, 8))}
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
			<ParameterButton
				label="FWHM"
				value={`${fwhmValue} km/s`}
				disabled={fwhmKmS === null}
				onClick={() => {
					if (fwhmKmS !== null) {
						onStartEdit("fwhmKmS", formatLineFitNumber(fwhmKmS, 6));
					}
				}}
			/>
		</Wrap>
	);
}
