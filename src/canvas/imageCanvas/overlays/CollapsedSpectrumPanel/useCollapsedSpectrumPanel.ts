import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CollapsedSpectrumViewModel } from "../../shared/types";
import {
	COLLAPSED_SPECTRUM_DEFAULT_FWHM_KM_S,
	COLLAPSED_SPECTRUM_DEFAULT_REFERENCE_WAVELENGTH_ANGSTROM,
	COLLAPSED_SPECTRUM_PANEL_HEIGHT,
	COLLAPSED_SPECTRUM_PANEL_MARGIN,
	COLLAPSED_SPECTRUM_PANEL_WIDTH,
	COLLAPSED_SPECTRUM_SPEED_OF_LIGHT_KM_S,
} from "./shared/constants";
import type { SpectrumPanelPoint, SpectrumPanelScales } from "./shared/types";

function getDefaultReferencePixel(spectrum: CollapsedSpectrumViewModel | null) {
	if (!spectrum || spectrum.bins.length === 0) {
		return 0;
	}

	return spectrum.bins[Math.floor((spectrum.bins.length - 1) / 2)]?.index ?? 0;
}

function resolveValueRange(points: SpectrumPanelPoint[]) {
	let yMin = Number.POSITIVE_INFINITY;
	let yMax = Number.NEGATIVE_INFINITY;

	for (const point of points) {
		const error = point.error ?? 0;
		yMin = Math.min(yMin, point.value - error);
		yMax = Math.max(yMax, point.value + error);
	}

	if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
		return { yMin: -1, yMax: 1 };
	}

	if (yMin === yMax) {
		return { yMin: yMin - 1, yMax: yMax + 1 };
	}

	const padding = (yMax - yMin) * 0.12;
	return { yMin: yMin - padding, yMax: yMax + padding };
}

function resolveVelocityRange(points: SpectrumPanelPoint[]) {
	let xMin = Number.POSITIVE_INFINITY;
	let xMax = Number.NEGATIVE_INFINITY;

	for (const point of points) {
		xMin = Math.min(xMin, point.velocityKmS);
		xMax = Math.max(xMax, point.velocityKmS);
	}

	if (!Number.isFinite(xMin) || !Number.isFinite(xMax)) {
		return { xMin: -1, xMax: 1 };
	}

	xMin = Math.min(xMin, 0);
	xMax = Math.max(xMax, 0);

	if (xMin === xMax) {
		return { xMin: xMin - 1, xMax: xMax + 1 };
	}

	return { xMin, xMax };
}

export function useCollapsedSpectrumPanel(
	spectrum: CollapsedSpectrumViewModel | null,
) {
	const [referencePixel, setReferencePixel] = useState(() =>
		getDefaultReferencePixel(spectrum),
	);
	const lastSpectrumSignatureRef = useRef<string | null>(null);
	const [referenceWavelengthAngstrom, setReferenceWavelengthAngstrom] =
		useState(COLLAPSED_SPECTRUM_DEFAULT_REFERENCE_WAVELENGTH_ANGSTROM);
	const [fwhmKmS, setFwhmKmS] = useState(COLLAPSED_SPECTRUM_DEFAULT_FWHM_KM_S);

	useEffect(() => {
		const signature = spectrum
			? `${spectrum.bins[0]?.index ?? 0}:${spectrum.bins.at(-1)?.index ?? 0}:${spectrum.bins.length}`
			: null;
		if (signature === lastSpectrumSignatureRef.current) {
			return;
		}

		lastSpectrumSignatureRef.current = signature;
		setReferencePixel(getDefaultReferencePixel(spectrum));
	}, [spectrum]);

	const velocityPerPixel =
		referenceWavelengthAngstrom > 0
			? ((spectrum?.angstromPerPixel ?? 0) *
					COLLAPSED_SPECTRUM_SPEED_OF_LIGHT_KM_S) /
				referenceWavelengthAngstrom
			: 0;

	const points = useMemo<SpectrumPanelPoint[]>(() => {
		if (!spectrum || !Number.isFinite(velocityPerPixel)) {
			return [];
		}

		return spectrum.bins.map((bin) => ({
			bin,
			velocityKmS: (bin.index - referencePixel) * velocityPerPixel,
			value: bin.value,
			error: bin.error,
		}));
	}, [referencePixel, spectrum, velocityPerPixel]);

	const scales = useMemo<SpectrumPanelScales>(() => {
		const innerWidth =
			COLLAPSED_SPECTRUM_PANEL_WIDTH -
			COLLAPSED_SPECTRUM_PANEL_MARGIN.left -
			COLLAPSED_SPECTRUM_PANEL_MARGIN.right;
		const innerHeight =
			COLLAPSED_SPECTRUM_PANEL_HEIGHT -
			COLLAPSED_SPECTRUM_PANEL_MARGIN.top -
			COLLAPSED_SPECTRUM_PANEL_MARGIN.bottom;
		const { xMin, xMax } = resolveVelocityRange(points);
		const { yMin, yMax } = resolveValueRange(points);
		const xRange = Math.max(xMax - xMin, 1e-6);
		const yRange = Math.max(yMax - yMin, 1e-6);

		return {
			xMin,
			xMax,
			yMin,
			yMax,
			innerWidth,
			innerHeight,
			xForVelocity: (velocityKmS: number) =>
				COLLAPSED_SPECTRUM_PANEL_MARGIN.left +
				((velocityKmS - xMin) / xRange) * innerWidth,
			yForValue: (value: number) =>
				COLLAPSED_SPECTRUM_PANEL_MARGIN.top +
				(1 - (value - yMin) / yRange) * innerHeight,
			velocityForX: (x: number) =>
				xMin +
				((x - COLLAPSED_SPECTRUM_PANEL_MARGIN.left) / innerWidth) * xRange,
		};
	}, [points]);

	const setReferenceFromSvgX = useCallback(
		(svgX: number) => {
			if (!Number.isFinite(velocityPerPixel) || velocityPerPixel === 0) {
				return;
			}

			const clampedX = Math.min(
				COLLAPSED_SPECTRUM_PANEL_MARGIN.left + scales.innerWidth,
				Math.max(COLLAPSED_SPECTRUM_PANEL_MARGIN.left, svgX),
			);
			const velocityAtPointer = scales.velocityForX(clampedX);
			setReferencePixel(
				(current) => current + velocityAtPointer / velocityPerPixel,
			);
		},
		[scales, velocityPerPixel],
	);

	return {
		points,
		scales,
		referencePixel,
		referenceWavelengthAngstrom,
		fwhmKmS,
		setReferenceWavelengthAngstrom,
		setFwhmKmS,
		setReferenceFromSvgX,
		hasData: points.length > 0,
	};
}
