import { useFitJobPolling } from "./hooks/useFitJobPolling";
import { useJobList } from "./hooks/useJobList";

export default function FitJobPoller() {
	const { activeJobs } = useJobList();
	useFitJobPolling(activeJobs);

	return null;
}
