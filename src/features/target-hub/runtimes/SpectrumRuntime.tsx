"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useExtractSpectrum } from "@/hooks/query/source";
import { useSourceStore } from "@/stores/source";
import { useFeedbackStore } from "../store/useFeedbackStore";

export default function SpectrumRuntime() {
	const activeSpectrumSourceIds = useSourceStore(
		useShallow((state) =>
			state.sources
				.filter(
					(source) =>
						source.spectrum.status === "committed" ||
						source.spectrum.status === "pending",
				)
				.map((source) => source.id),
		),
	);

	return (
		<>
			{activeSpectrumSourceIds.map((sourceId) => (
				<SpectrumRuntimeTask key={sourceId} sourceId={sourceId} />
			))}
		</>
	);
}

function SpectrumRuntimeTask({ sourceId }: { sourceId: string }) {
	const source = useSourceStore(
		(state) => state.sources.find((item) => item.id === sourceId) ?? null,
	);
	const setSourceSpectrumStatus = useSourceStore(
		(state) => state.setSourceSpectrumStatus,
	);
	const emitEffect = useFeedbackStore((state) => state.emitEffect);
	const extractionParams = source?.spectrum.extractionParams ?? null;
	const ra = source?.position.ra ?? null;
	const dec = source?.position.dec ?? null;
	const { data, isFetching, refetch } = useExtractSpectrum({
		selectedFootprintId: source?.imageRef.footprintId ?? undefined,
		waveMin: extractionParams?.waveMinUm ?? 0,
		waveMax: extractionParams?.waveMaxUm ?? 0,
		apertureSize: extractionParams?.apertureSize ?? 0,
		ra: ra ?? undefined,
		dec: dec ?? undefined,
		enabled: false,
	});

	useEffect(() => {
		if (!source || source.spectrum.status !== "committed") {
			return;
		}

		if (extractionParams === null || ra === null || dec === null) {
			setSourceSpectrumStatus(source.id, "error");
			return;
		}

		void refetch();
	}, [dec, extractionParams, ra, refetch, setSourceSpectrumStatus, source]);

	useEffect(() => {
		if (!source) {
			return;
		}

		if (isFetching) {
			if (source.spectrum.status !== "pending") {
				setSourceSpectrumStatus(source.id, "pending");
			}
			return;
		}

		if (source.spectrum.status !== "pending") {
			return;
		}

		if (!data) {
			setSourceSpectrumStatus(source.id, "error");
			emitEffect("source-error", source.color);
			return;
		}

		if (data.covered) {
			setSourceSpectrumStatus(source.id, "ready");
			emitEffect("source-ready", source.color);
			return;
		}

		setSourceSpectrumStatus(source.id, "uncovered");
	}, [data, emitEffect, isFetching, setSourceSpectrumStatus, source]);

	return null;
}
