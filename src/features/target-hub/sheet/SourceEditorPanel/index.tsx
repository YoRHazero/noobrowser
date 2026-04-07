"use client";

import { SourceEditorView } from "./SourceEditorView";
import { useSourceEditorPanel } from "./useSourceEditorPanel";

export default function SourceEditorPanel() {
	const viewModel = useSourceEditorPanel();

	return <SourceEditorView {...viewModel} />;
}
