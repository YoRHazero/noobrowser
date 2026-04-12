"use client";

import type { ReactNode } from "react";
import { EditorView } from "./EditorView";
import { useEditor } from "./useEditor";

interface EditorProps {
	detailActionAddon?: ReactNode;
}

export default function Editor({ detailActionAddon }: EditorProps) {
	const viewModel = useEditor();

	return <EditorView {...viewModel} detailActionAddon={detailActionAddon} />;
}
