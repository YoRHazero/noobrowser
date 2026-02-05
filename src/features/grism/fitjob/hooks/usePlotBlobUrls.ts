import { useEffect, useState } from "react";

type PlotBlobs = {
	comparison?: Blob | null;
	spectrum?: Blob | null;
	posterior?: Blob | null;
	trace?: Blob | null;
};

export function usePlotBlobUrls(blobs: PlotBlobs) {
	/* -------------------------------------------------------------------------- */
	/*                                 Local State                                */
	/* -------------------------------------------------------------------------- */
	const [comparisonUrl, setComparisonUrl] = useState<string | null>(null);
	const [spectrumUrl, setSpectrumUrl] = useState<string | null>(null);
	const [posteriorUrl, setPosteriorUrl] = useState<string | null>(null);
	const [traceUrl, setTraceUrl] = useState<string | null>(null);

	/* -------------------------------------------------------------------------- */
	/*                                   Effects                                  */
	/* -------------------------------------------------------------------------- */
	useEffect(() => {
		if (!blobs.comparison) {
			setComparisonUrl(null);
			return;
		}
		const url = URL.createObjectURL(blobs.comparison);
		setComparisonUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [blobs.comparison]);

	useEffect(() => {
		if (!blobs.spectrum) {
			setSpectrumUrl(null);
			return;
		}
		const url = URL.createObjectURL(blobs.spectrum);
		setSpectrumUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [blobs.spectrum]);

	useEffect(() => {
		if (!blobs.posterior) {
			setPosteriorUrl(null);
			return;
		}
		const url = URL.createObjectURL(blobs.posterior);
		setPosteriorUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [blobs.posterior]);

	useEffect(() => {
		if (!blobs.trace) {
			setTraceUrl(null);
			return;
		}
		const url = URL.createObjectURL(blobs.trace);
		setTraceUrl(url);
		return () => {
			URL.revokeObjectURL(url);
		};
	}, [blobs.trace]);

	/* -------------------------------------------------------------------------- */
	/*                                   Return                                   */
	/* -------------------------------------------------------------------------- */
	return {
		comparisonUrl,
		spectrumUrl,
		posteriorUrl,
		traceUrl,
	};
}
