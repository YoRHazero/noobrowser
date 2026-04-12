"use client";

import { useShallow } from "zustand/react/shallow";
import { useFitJobActionsModel } from "./hooks/useFitJobActionsModel";
import { useFitJobDetailModel } from "./hooks/useFitJobDetailModel";
import { useFitJobListModel } from "./hooks/useFitJobListModel";
import { useFitJobPlotModels } from "./hooks/useFitJobPlotModels";
import { useFitJobStore } from "./store";

export function useFitJob() {
	const { jobsDrawerOpen, openJobsDrawer, closeJobsDrawer } = useFitJobStore(
		useShallow((state) => ({
			jobsDrawerOpen: state.jobsDrawerOpen,
			openJobsDrawer: state.openJobsDrawer,
			closeJobsDrawer: state.closeJobsDrawer,
		})),
	);

	const list = useFitJobListModel();
	const detail = useFitJobDetailModel(list);
	const plots = useFitJobPlotModels({
		jobId: detail.selectedJob?.job_id ?? null,
		status: detail.status,
		summary: detail.summary,
		selectedModelName: detail.selectedModelName,
	});
	const actions = useFitJobActionsModel({
		selectedJobId: list.selectedJobId,
		status: detail.status,
		onClearSelectedJob: list.onClearSelectedJob,
	});

	return {
		isOpen: jobsDrawerOpen,
		openJobsDrawer,
		closeJobsDrawer,
		list,
		detail,
		plots: plots.plots,
		actions,
	};
}
