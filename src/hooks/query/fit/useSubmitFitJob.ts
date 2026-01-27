import type { Query } from "@tanstack/query-core";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toaster } from "@/components/ui/toaster";
import { useConnectionStore } from "@/stores/connection";
import { useFitStore } from "@/stores/fit";
import { useSourcesStore } from "@/stores/sources";
import type {
	ExtractionBackendConfiguration,
	FitBackendConfiguration,
	FitBodyRequest,
	FitJobResponse,
	SourceMetaBackend,
	SubmitMutationVariables,
} from "./schemas";

type ApiErrorDetail = {
	loc: Array<string | number>;
	msg: string;
};

export function useSubmitFitJobMutation() {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const traceSources = useSourcesStore((state) => state.traceSources);

	const storedConfiguration = useFitStore((state) => state.configurations);

	return useMutation<FitJobResponse, Error, SubmitMutationVariables>({
		mutationFn: async (variables) => {
			const { sourceId, sourceMeta, extractionConfig, fitConfigs } = variables;

			const finalExtractionConfig: ExtractionBackendConfiguration =
				extractionConfig ?? {
					aperture_size: 5,
					extraction_mode: "GRISMR",
				};
			const finalFitConfigs: FitBackendConfiguration[] =
				fitConfigs ??
				storedConfiguration
					.filter((config) => config.selected)
					.map((config) => ({
						model_name: config.name,
						models: config.models,
					}));
			if (finalFitConfigs.length === 0) {
				throw new Error(
					"No fit configurations selected. Please select at least one configuration.",
				);
			}
			let finalSourceMeta: SourceMetaBackend;
			if (sourceMeta) {
				finalSourceMeta = sourceMeta;
			} else {
				const traceSource = traceSources.find((s) => s.id === sourceId);
				if (!traceSource) {
					throw new Error(`Trace source with ID ${sourceId} not found.`);
				}
				finalSourceMeta = {
					source_id: traceSource.id,
					ra: traceSource.ra,
					dec: traceSource.dec,
					x: traceSource.x,
					y: traceSource.y,
					group_id: traceSource.groupId,
					z: traceSource.z,
				};
			}
			const payload: FitBodyRequest = {
				extraction: {
					extraction_config: finalExtractionConfig,
					source_meta: finalSourceMeta,
				},
				fit: finalFitConfigs,
			};
			try {
				const response = await axios.post(`${backendUrl}/fit/submit/`, payload);
				return response.data as FitJobResponse;
			} catch (error) {
				if (axios.isAxiosError(error) && error.response) {
					const data = error.response.data;
					let errorMsg = "Unknown error";

					if (data?.detail) {
						if (Array.isArray(data.detail)) {
							const detail = data.detail as ApiErrorDetail[];
							errorMsg = detail
								.map((err) => `${err.loc.join(".")} -> ${err.msg}`)
								.join("\n");
						} else if (typeof data.detail === "object") {
							errorMsg = JSON.stringify(data.detail);
						} else {
							errorMsg = String(data.detail);
						}
					} else if (data?.message) {
						errorMsg = data.message;
					} else {
						errorMsg = error.message;
					}
					throw new Error(`Fit job submission failed:\n${errorMsg}`);
				}
				throw error;
			}
		},
		onSuccess: (data, _variables) => {
			toaster.success({
				title: "Fit Job Submitted",
				description: `Job ID: ${data.job_id.slice(0, 8)}`,
			});
			useFitStore.getState().addJob(data);
		},
		onError: (error) => {
			toaster.error({
				title: "Fit Job Submission Failed",
				description: error.message,
			});
		},
	});
}

export function useFitJobStatusQuery() {
	const jobs = useFitStore((state) => state.jobs);

	// Filter jobs that need polling (pending or processing)
	const activeJobs = jobs.filter(
		(job) => job.status === "pending" || job.status === "processing",
	);

	const backendUrl = useConnectionStore((state) => state.backendUrl);

	useQueries({
		queries: activeJobs.map((job) => ({
			queryKey: ["fit_job_status", job.job_id],
			queryFn: async () => {
				const response = await axios.get(
					`${backendUrl}/fit/status/${job.job_id}/`,
				);
				return response.data as FitJobResponse;
			},
			refetchInterval: (query: Query<FitJobResponse>) => {
				const status = query.state.data?.status;
				if (status === "completed" || status === "failed") {
					return false;
				}
				return 3000; // Poll every 3 seconds
			},
		})),
	});
}

// Inner hook for single job polling, much cleaner to handle updates
export function useSingleJobPoller(jobId: string) {
	const backendUrl = useConnectionStore((state) => state.backendUrl);

	const existingJob = useFitStore((state) =>
		state.jobs.find((j) => j.job_id === jobId),
	);

	return useQuery({
		queryKey: ["fit_job_status", jobId],
		queryFn: async () => {
			const response = await axios.get(`${backendUrl}/fit/status/${jobId}/`);
			return response.data as FitJobResponse;
		},
		enabled:
			!!jobId &&
			(existingJob?.status === "pending" ||
				existingJob?.status === "processing"),
		refetchInterval: (query) => {
			const status = query.state.data?.status;
			if (status === "completed" || status === "failed") {
				return false;
			}
			return 3000;
		},
	});
}
