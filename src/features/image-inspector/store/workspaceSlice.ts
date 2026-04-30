"use client";

import type { StateCreator } from "zustand";
import { IMAGE_INSPECTOR_DEFAULT_WORKSPACE_SECTION } from "../shared/constants";
import type { WorkspaceSection } from "../shared/types";
import type { ImageInspectorStore } from "./index";

export interface WorkspaceSlice {
	workspaceOpen: boolean;
	activeWorkspaceSection: WorkspaceSection;
	setWorkspaceOpen: (open: boolean) => void;
	setActiveWorkspaceSection: (section: WorkspaceSection) => void;
	toggleWorkspaceSection: (section: WorkspaceSection) => void;
}

export const createWorkspaceSlice: StateCreator<
	ImageInspectorStore,
	[],
	[],
	WorkspaceSlice
> = (set, get) => ({
	workspaceOpen: false,
	activeWorkspaceSection: IMAGE_INSPECTOR_DEFAULT_WORKSPACE_SECTION,
	setWorkspaceOpen: (workspaceOpen) => set({ workspaceOpen }),
	setActiveWorkspaceSection: (activeWorkspaceSection) =>
		set({ activeWorkspaceSection }),
	toggleWorkspaceSection: (section) => {
		const { workspaceOpen, activeWorkspaceSection } = get();
		if (workspaceOpen && activeWorkspaceSection === section) {
			set({ workspaceOpen: false });
			return;
		}

		set({
			workspaceOpen: true,
			activeWorkspaceSection: section,
		});
	},
});
