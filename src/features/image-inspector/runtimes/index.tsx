"use client";

import BaseLayerFetchRuntime from "./BaseLayerFetchRuntime";
import CounterpartImageRuntime from "./CounterpartImageRuntime";
import SourceAnnotationRuntime from "./SourceAnnotationRuntime";

export default function Runtimes() {
	return (
		<>
			<BaseLayerFetchRuntime />
			<CounterpartImageRuntime />
			<SourceAnnotationRuntime />
		</>
	);
}
