"use client";

import { useFeedbackLifecycle } from "./useFeedbackLifecycle";
import {
	useSpectrumRuntime,
	useSpectrumRuntimeTask,
} from "./useSpectrumRuntime";

export default function Runtime() {
	useFeedbackLifecycle();

	const { activeSpectrumSourceIds } = useSpectrumRuntime();

	return (
		<>
			{activeSpectrumSourceIds.map((sourceId) => (
				<SpectrumRuntimeTask key={sourceId} sourceId={sourceId} />
			))}
		</>
	);
}

function SpectrumRuntimeTask({ sourceId }: { sourceId: string }) {
	useSpectrumRuntimeTask(sourceId);

	return null;
}
