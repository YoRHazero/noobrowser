"use client";

import { useEditorFootprintModel } from "./hooks/useEditorFootprintModel";
import { useEditorHeaderModel } from "./hooks/useEditorHeaderModel";
import { useEditorIdentityModel } from "./hooks/useEditorIdentityModel";
import { useEditorSpectrumModel } from "./hooks/useEditorSpectrumModel";
import type { EditorModel } from "./shared/types";

export function useEditor(): EditorModel {
	const header = useEditorHeaderModel();
	const { identity, skyPosition } = useEditorIdentityModel();
	const { footprint, imagePosition } = useEditorFootprintModel();
	const { extraction, spectrum, actions } = useEditorSpectrumModel();

	return {
		header,
		identity,
		skyPosition,
		imagePosition,
		footprint,
		extraction,
		spectrum,
		actions,
	};
}
