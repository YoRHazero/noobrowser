"use client";

import { useEffect, useState } from "react";

type PlotBlobMap = {
	comparison?: Blob | null;
	spectrum?: Blob | null;
	posterior?: Blob | null;
	trace?: Blob | null;
};

function createObjectUrl(blob: Blob | null | undefined) {
	if (!blob) {
		return null;
	}

	return URL.createObjectURL(blob);
}

export function usePlotBlobUrls(blobs: PlotBlobMap) {
	const [comparisonUrl, setComparisonUrl] = useState<string | null>(null);
	const [spectrumUrl, setSpectrumUrl] = useState<string | null>(null);
	const [posteriorUrl, setPosteriorUrl] = useState<string | null>(null);
	const [traceUrl, setTraceUrl] = useState<string | null>(null);

	useEffect(() => {
		const url = createObjectUrl(blobs.comparison);
		setComparisonUrl(url);
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [blobs.comparison]);

	useEffect(() => {
		const url = createObjectUrl(blobs.spectrum);
		setSpectrumUrl(url);
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [blobs.spectrum]);

	useEffect(() => {
		const url = createObjectUrl(blobs.posterior);
		setPosteriorUrl(url);
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [blobs.posterior]);

	useEffect(() => {
		const url = createObjectUrl(blobs.trace);
		setTraceUrl(url);
		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [blobs.trace]);

	return {
		comparisonUrl,
		spectrumUrl,
		posteriorUrl,
		traceUrl,
	};
}
