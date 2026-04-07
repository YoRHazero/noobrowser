"use client";

import {
	useTargetHubSpectrumManager,
	useTargetHubSpectrumTask,
} from "./hooks/useTargetHubSpectrumManager";

export function TargetHubSpectrumManager() {
	const { activeSpectrumSourceIds } = useTargetHubSpectrumManager();

	return (
		<>
			{activeSpectrumSourceIds.map((sourceId) => (
				<TargetHubSpectrumTask key={sourceId} sourceId={sourceId} />
			))}
		</>
	);
}

function TargetHubSpectrumTask({ sourceId }: { sourceId: string }) {
	useTargetHubSpectrumTask(sourceId);

	return null;
}
