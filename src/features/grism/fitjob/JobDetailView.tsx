import { Drawer, Flex, Text } from "@chakra-ui/react";
import { Info } from "lucide-react";
import { useFitJobs } from "./hooks/useFitJobs";
import { FitJobResultTabs } from "./components/FitJobResultTabs";

interface JobDetailViewProps {
	selectedJobId: string | null;
}

export default function JobDetailView({ selectedJobId }: JobDetailViewProps) {
	const { jobs } = useFitJobs();

	const selectedJob = jobs.find((j) => j.job_id === selectedJobId);

	if (!selectedJob) {
		return (
			<Drawer.Body
				pt={0}
				px={0}
				className="custom-scrollbar"
				bg="blackAlpha.200"
			>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					color="gray.500"
				>
					<Info size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
					<Text>Select a completed job to view results.</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	if (!selectedJob.result) {
		return (
			<Drawer.Body
				pt={0}
				px={0}
				className="custom-scrollbar"
				bg="blackAlpha.200"
			>
				<Flex
					direction="column"
					align="center"
					justify="center"
					h="full"
					color="gray.500"
				>
					<Text>No results available for this job.</Text>
				</Flex>
			</Drawer.Body>
		);
	}

	return (
		<Drawer.Body pt={0} px={0} className="custom-scrollbar" bg="blackAlpha.200">
			<FitJobResultTabs result={selectedJob.result} />
		</Drawer.Body>
	);
}
