"use client";

import { EditorView } from "./EditorView";
import { useEditor } from "./useEditor";

export default function Editor() {
	const viewModel = useEditor();

	return <EditorView {...viewModel} />;
}
