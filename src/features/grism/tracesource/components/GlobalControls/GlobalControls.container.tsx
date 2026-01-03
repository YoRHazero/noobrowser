"use client";

import type { GlobalSettings, SetSettings } from "../../types";
import GlobalControlsView from "./GlobalControls.view";

export default function GlobalControlsContainer(props: {
	settings: GlobalSettings;
	setSettings: SetSettings;
	onClearAll: () => void;
	onApplyRoi: () => void;
	totalSources: number;
	mainTraceSourceId: string | null;
}) {
	const {
		settings,
		setSettings,
		onClearAll,
		onApplyRoi,
		totalSources,
		mainTraceSourceId,
	} = props;

	const isValid = settings.waveMin < settings.waveMax;
	const hasSources = totalSources > 0;

	return (
		<GlobalControlsView
			settings={settings}
			setSettings={setSettings}
			isValid={isValid}
			hasSources={hasSources}
			totalSources={totalSources}
			mainTraceSourceId={mainTraceSourceId}
			onApplyRoi={onApplyRoi}
			onClearAll={onClearAll}
		/>
	);
}
