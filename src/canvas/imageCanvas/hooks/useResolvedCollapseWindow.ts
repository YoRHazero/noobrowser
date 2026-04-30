import { useCallback, useEffect, useMemo, useState } from "react";
import type { Rect } from "../api";
import {
	clampRoiLocalRect,
	createDefaultCollapseWindow,
	resolveCollapseWindow,
} from "../utils";

export function useResolvedCollapseWindow({
	roi,
	controlledWindow,
	onChange,
}: {
	roi: Rect | null;
	controlledWindow: Rect | undefined;
	onChange: ((window: Rect) => void) | undefined;
}): {
	collapseWindow: Rect | null;
	setCollapseWindow: (window: Rect) => void;
} {
	const [internalWindow, setInternalWindow] = useState<Rect | null>(() =>
		roi ? createDefaultCollapseWindow(roi) : null,
	);

	useEffect(() => {
		if (!roi) {
			setInternalWindow(null);
			return;
		}

		setInternalWindow((current) =>
			current
				? clampRoiLocalRect(current, roi)
				: createDefaultCollapseWindow(roi),
		);
	}, [roi]);

	const collapseWindow = useMemo(() => {
		if (!roi) {
			return null;
		}

		return controlledWindow
			? resolveCollapseWindow({ roi, collapseWindow: controlledWindow })
			: (internalWindow ?? createDefaultCollapseWindow(roi));
	}, [controlledWindow, internalWindow, roi]);

	const setCollapseWindow = useCallback(
		(window: Rect) => {
			if (!roi) {
				return;
			}

			const clampedWindow = clampRoiLocalRect(window, roi);
			if (!controlledWindow) {
				setInternalWindow(clampedWindow);
			}
			onChange?.(clampedWindow);
		},
		[controlledWindow, onChange, roi],
	);

	return {
		collapseWindow,
		setCollapseWindow,
	};
}
