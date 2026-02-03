import { Drawer } from "@chakra-ui/react";
import { useState } from "react";
import FitJobPoller from "./FitJobPoller";
import JobActionFooter from "./JobActionFooter";
import JobDetailView from "./JobDetailView";
import JobListView from "./JobListView";

/* -------------------------------------------------------------------------- */
/*                             Main Drawer Component                          */
/* -------------------------------------------------------------------------- */

export default function GrismFitJobDrawer({
	children,
}: {
	children: React.ReactNode;
}) {
	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

	// Optional: Tie selection to store if needed globally, but local is fine as per plan.
	// But wait, the original code had:
	// const removeJob = useFitStore((state) => state.removeJob);
	// And handled selection clearing on remove.
	// The `JobActionFooter` and `JobListView` handle actions, but if a job is removed,
	// we might need to clear selection in this parent if the selected job is gone.
	// However, `JobDetailView` handles "not found" gracefully.
	// So we can keep it simple.

	const handleSelectJob = (id: string, _status: string) => {
		if (selectedJobId === id) {
			setSelectedJobId(null);
		} else {
			setSelectedJobId(id);
		}
	};

	return (
		<Drawer.Root placement="end" size="xl">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>
				{children}
			</Drawer.Trigger>
			<Drawer.Positioner>
				<Drawer.Content bg="#09090b" borderLeft="1px solid #333">
					<FitJobPoller />
					<JobListView
						selectedJobId={selectedJobId}
						onSelectJob={handleSelectJob}
					/>
					<JobDetailView selectedJobId={selectedJobId} />
					<JobActionFooter selectedJobId={selectedJobId} />
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
