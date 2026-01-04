
import { useFitStore } from "@/stores/fit";
import { useSingleJobPoller } from "@/hook/connection-hook";
import { useEffect } from "react";

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
	const jobs = useFitStore((state) => state.jobs);
	
	// Select jobs that need polling
	const activeJobs = jobs.filter(
		(job) => job.status === "pending" || job.status === "processing"
	);

	return (
		<>
			{activeJobs.map((job) => (
				<SingleJobPoller key={job.job_id} jobId={job.job_id} />
			))}
		</>
	);
}
