"use client";

import FeedbackRuntime from "./FeedbackRuntime";
import FitJobRuntime from "./FitJobRuntime";
import SpectrumRuntime from "./SpectrumRuntime";

export default function Runtimes() {
	return (
		<>
			<FitJobRuntime />
			<FeedbackRuntime />
			<SpectrumRuntime />
		</>
	);
}
