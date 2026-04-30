"use client";

import BaseLayerFetchRuntime from "./BaseLayerFetchRuntime";
import CounterpartImageRuntime from "./CounterpartImageRuntime";

export default function Runtimes() {
	return (
		<>
			<BaseLayerFetchRuntime />
			<CounterpartImageRuntime />
		</>
	);
}
