import { Box, CloseButton, Drawer, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import { useFitJobActions } from "./hooks/useFitJobActions";
import { useFitJobs } from "./hooks/useFitJobs";
import { JobListItem } from "./components/JobListItem";

interface JobListViewProps {
	selectedJobId: string | null;
	onSelectJob: (id: string, status: string) => void;
}

export default function JobListView({
	selectedJobId,
	onSelectJob,
}: JobListViewProps) {
	const { jobs } = useFitJobs();
	const { handleRemoveJob } = useFitJobActions();

	// Sort logic: newest first
	const sortedJobs = [...jobs].reverse();

	return (
		<Drawer.Header borderBottom="1px solid #222" pb={4}>
			<HStack justify="space-between">
				<Heading size="sm" color="white">
					Fit Jobs
				</Heading>
				<Drawer.CloseTrigger asChild>
					<CloseButton size="md" />
				</Drawer.CloseTrigger>
			</HStack>

			{/* Job List Header */}
			<Box mt={4} mb={2}>
				<Box h="120px" overflowY="auto" pr={2} className="custom-scrollbar">
					<Flex direction="column" gap={2}>
						{sortedJobs.map((job) => (
							<JobListItem
								key={job.job_id}
								job={job}
								isSelected={selectedJobId === job.job_id}
								onSelect={onSelectJob}
								onRemove={handleRemoveJob}
							/>
						))}
						{sortedJobs.length === 0 && (
							<Text color="gray.500" fontSize="xs" textAlign="center" py={2}>
								No jobs found.
							</Text>
						)}
					</Flex>
				</Box>
			</Box>
		</Drawer.Header>
	);
}
