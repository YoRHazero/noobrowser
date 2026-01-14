import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { toaster } from "@/components/ui/toaster";
import { useSource } from "@/hooks/query/source";
import { useSourcesStore } from "@/stores/sources";
import type { TraceSource } from "@/stores/stores-types";

const SingleSpectrumPoller = ({ source }: { source: TraceSource }) => {
	const updateTraceSource = useSourcesStore((state) => state.updateTraceSource);
	const { spectrumQuery } = useSource({
		source,
		specEnabled: false,
	});
	const lastUpdateRef = useRef(0);
	const lastErrorRef = useRef(0);

	useEffect(() => {
		if (!spectrumQuery.data) {
			return;
		}
		if (spectrumQuery.dataUpdatedAt === lastUpdateRef.current) {
			return;
		}
		lastUpdateRef.current = spectrumQuery.dataUpdatedAt;
		const isCovered = spectrumQuery.data.covered;
		if (isCovered) {
			updateTraceSource(source.id, { spectrumReady: true });
			queueMicrotask(() => {
				toaster.success({
					title: "Spectrum Extracted",
					description: `Source ${source.id.slice(0, 8)} is covered.`,
				});
			});
		} else {
			queueMicrotask(() => {
				toaster.create({
					type: "warning",
					title: "Not Covered",
					description: `Source ${source.id.slice(0, 8)} has no spectrum data.`,
				});
			});
		}
	}, [
		spectrumQuery.data,
		spectrumQuery.dataUpdatedAt,
		source.id,
		updateTraceSource,
	]);

	useEffect(() => {
		if (!spectrumQuery.isError || !spectrumQuery.error) {
			return;
		}
		if (spectrumQuery.errorUpdatedAt === lastErrorRef.current) {
			return;
		}
		lastErrorRef.current = spectrumQuery.errorUpdatedAt;
		if (source.spectrumReady) {
			updateTraceSource(source.id, { spectrumReady: false });
		}
		queueMicrotask(() => {
			toaster.error({
				title: "Fetch Failed",
				description: `Source ${source.id.slice(0, 8)}: ${(spectrumQuery.error as Error).message}`,
			});
		});
	}, [
		spectrumQuery.isError,
		spectrumQuery.error,
		spectrumQuery.errorUpdatedAt,
		source.id,
		source.spectrumReady,
		updateTraceSource,
	]);

	return null;
};

export default function SpectrumPoller() {
	const traceSources = useSourcesStore(
		useShallow((state) => state.traceSources),
	);
	const pollableSources = traceSources.filter(
		(source) => source.groupId !== null && source.groupId !== undefined,
	);

	return (
		<>
			{pollableSources.map((source) => (
				<SingleSpectrumPoller key={source.id} source={source} />
			))}
		</>
	);
}
