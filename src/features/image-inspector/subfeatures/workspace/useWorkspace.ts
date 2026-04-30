"use client";

import { useShallow } from "zustand/react/shallow";
import type { WorkspaceSection } from "../../shared/types";
import { useImageInspectorStore } from "../../store";

export interface WorkspaceViewModel {
	open: boolean;
	activeSection: WorkspaceSection;
	onSectionToggle: (section: WorkspaceSection) => void;
	onClose: () => void;
}

export function useWorkspace(): WorkspaceViewModel {
	const { open, activeSection, setWorkspaceOpen, toggleWorkspaceSection } =
		useImageInspectorStore(
			useShallow((state) => ({
				open: state.workspaceOpen,
				activeSection: state.activeWorkspaceSection,
				setWorkspaceOpen: state.setWorkspaceOpen,
				toggleWorkspaceSection: state.toggleWorkspaceSection,
			})),
		);

	return {
		open,
		activeSection,
		onSectionToggle: toggleWorkspaceSection,
		onClose: () => setWorkspaceOpen(false),
	};
}
