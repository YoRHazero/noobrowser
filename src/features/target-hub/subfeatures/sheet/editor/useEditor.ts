"use client";

import {
	type EditorFootprintModel,
	type EditorImagePositionModel,
	useEditorFootprintModel,
} from "./hooks/useEditorFootprintModel";
import {
	type EditorHeaderModel,
	useEditorHeaderModel,
} from "./hooks/useEditorHeaderModel";
import {
	type EditorIdentityModel,
	type EditorSkyPositionModel,
	useEditorIdentityModel,
} from "./hooks/useEditorIdentityModel";
import {
	type EditorActionsModel,
	type EditorExtractionModel,
	type EditorSpectrumModel,
	useEditorSpectrumModel,
} from "./hooks/useEditorSpectrumModel";

export interface EditorViewModel {
	header: EditorHeaderModel;
	identity: EditorIdentityModel;
	skyPosition: EditorSkyPositionModel;
	imagePosition: EditorImagePositionModel;
	footprint: EditorFootprintModel;
	extraction: EditorExtractionModel;
	spectrum: EditorSpectrumModel;
	actions: EditorActionsModel;
}

export function useEditor(): EditorViewModel {
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
