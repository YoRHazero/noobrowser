import { useEffect } from "react";
import { useSingleJobPoller } from "@/hooks/query/fit/useSingleJobPoller";
import { useFitStore } from "@/stores/fit";
import { useFitJobs } from "./hooks/useFitJobs";

/* -------------------- Single Job Poller Wrapper ------------------- */
const SingleJobPoller = ({ jobId }: { jobId: string }) => {
	const { data } = useSingleJobPoller(jobId);
	const updateJob = useFitStore((state) => state.updateJob);

	useEffect(() => {
		if (data) {
			updateJob(data);
		}
	}, [data, updateJob]);

	return null;
};

/* -------------------------- Main Component ------------------------ */
export default function FitJobPoller() {
	const { activeJobs } = useFitJobs();

	return (
		<>
			{activeJobs.map((job) => (
				<SingleJobPoller key={job.job_id} jobId={job.job_id} />
			))}
		</>
	);
}
