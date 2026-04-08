"use client";

import { SourcesView } from "./SourcesView";
import { useSources } from "./useSources";

export default function Sources() {
	const viewModel = useSources();

	return <SourcesView {...viewModel} />;
}
