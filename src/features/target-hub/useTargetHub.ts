"use client";

import { useShellStore } from "./store/useShellStore";

export function useTargetHub() {
	const mode = useShellStore((state) => state.mode);

	return {
		mode,
	};
}
