"use client";

import { create } from "zustand";
import {
	type AnnotationLayerSlice,
	createAnnotationLayerSlice,
} from "./annotationLayerSlice";
import { type BaseLayerSlice, createBaseLayerSlice } from "./baseLayerSlice";
import {
	createReferenceLayerSlice,
	type ReferenceLayerSlice,
} from "./referenceLayerSlice";
import { createWorkspaceSlice, type WorkspaceSlice } from "./workspaceSlice";

export type ImageInspectorStore = WorkspaceSlice &
	ReferenceLayerSlice &
	BaseLayerSlice &
	AnnotationLayerSlice;

export const useImageInspectorStore = create<ImageInspectorStore>()(
	(...args) => ({
		...createWorkspaceSlice(...args),
		...createReferenceLayerSlice(...args),
		...createBaseLayerSlice(...args),
		...createAnnotationLayerSlice(...args),
	}),
);

export type { AnnotationLayerSlice } from "./annotationLayerSlice";
export type { BaseLayerNormState, BaseLayerSlice } from "./baseLayerSlice";
export type { ReferenceLayerSlice } from "./referenceLayerSlice";
export type { WorkspaceSlice } from "./workspaceSlice";
