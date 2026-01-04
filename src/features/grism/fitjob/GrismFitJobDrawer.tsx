
import {
	Drawer,
} from "@chakra-ui/react";
import { useFitStore } from "@/stores/fit";
import { useState } from "react";
import GrismFitJobDrawerHeader from "./GrismFitJobDrawerHeader";
import GrismFitJobDrawerBody from "./GrismFitJobDrawerBody";
import GrismFitJobDrawerFooter from "./GrismFitJobDrawerFooter";

/* -------------------------------------------------------------------------- */
/*                             Main Drawer Component                          */
/* -------------------------------------------------------------------------- */

export default function GrismFitJobDrawer({ children }: { children: React.ReactNode }) {
	const jobs = useFitStore((state) => state.jobs);
	const removeJob = useFitStore((state) => state.removeJob);

	const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

	// Ensure selected job exists and get it
	const selectedJob = jobs.find((j) => j.job_id === selectedJobId);

	const handleSelectJob = (id: string, status: string) => {
        // Allow selection handling. Toggling off if selected.
        if (selectedJobId === id) {
            setSelectedJobId(null);
        } else {
            setSelectedJobId(id);
        }
	};
    
    const handleRemoveJob = (id: string) => {
        removeJob(id);
        if (selectedJobId === id) {
            setSelectedJobId(null);
        }
    }

	return (
		<Drawer.Root placement="end" size="xl">
			<Drawer.Backdrop />
			<Drawer.Trigger asChild>{children}</Drawer.Trigger>
			<Drawer.Positioner>
				<Drawer.Content bg="#09090b" borderLeft="1px solid #333">
                    <GrismFitJobDrawerHeader 
                        jobs={jobs} 
                        selectedJobId={selectedJobId} 
                        onSelectJob={handleSelectJob} 
                        onRemoveJob={handleRemoveJob} 
                    />
                    <GrismFitJobDrawerBody selectedJob={selectedJob} />
                    <GrismFitJobDrawerFooter />
				</Drawer.Content>
			</Drawer.Positioner>
		</Drawer.Root>
	);
}
