"use client";

import type { SourceAnnotation } from "@/canvas/imageCanvas";
import { useImageInspectorStore } from "../store";

export function useImageInspectorSourceAnnotations(): SourceAnnotation[] {
	return useImageInspectorStore((state) => state.annotationLayerSources);
}
