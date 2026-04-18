"use client";

import type { SpectrumWorkspaceStore } from "./index";
import { useSpectrumWorkspaceStoreBase } from "./index";

export function useSpectrumWorkspaceStore<T>(
	selector: (state: SpectrumWorkspaceStore) => T,
): T {
	return useSpectrumWorkspaceStoreBase(selector);
}
