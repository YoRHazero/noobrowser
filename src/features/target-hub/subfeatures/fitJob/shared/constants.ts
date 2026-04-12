import {
	FIT_JOB_ACTIVE_REFETCH_INTERVAL_MS,
	FIT_JOB_DRAWER_WIDTH,
	FIT_JOB_EFFECT_COLOR,
	FIT_JOB_ERROR_COLOR,
	FIT_JOB_LIST_LIMIT,
} from "../../../shared/constants";
import type { FitJobPlotKind } from "./types";

export const FIT_JOB_PLOT_TITLES: Record<FitJobPlotKind, string> = {
	comparison: "Model Comparison",
	spectrum: "Spectrum",
	posterior: "Posterior",
	trace: "Trace",
};

export {
	FIT_JOB_ACTIVE_REFETCH_INTERVAL_MS,
	FIT_JOB_DRAWER_WIDTH,
	FIT_JOB_EFFECT_COLOR,
	FIT_JOB_ERROR_COLOR,
	FIT_JOB_LIST_LIMIT,
};
