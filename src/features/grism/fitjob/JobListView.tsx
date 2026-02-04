import { Box, CloseButton, Drawer, Flex, Heading, HStack, ScrollArea, Text } from "@chakra-ui/react";
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
				<Heading size="sm" color="white" whiteSpace="nowrap">
					Fit Jobs
				</Heading>
				<Drawer.CloseTrigger asChild>
					<CloseButton size="md" />
				</Drawer.CloseTrigger>
			</HStack>

			{/* Job List Header */}
			<Box mt={4} mb={2}>
				<ScrollArea.Root maxW="600px">
					<ScrollArea.Viewport>
						<ScrollArea.Content pb={4}>
							<Flex direction="row" gap={2} align="center">
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
									<Text
										color="gray.500"
										fontSize="xs"
										textAlign="center"
										py={2}
										w="full"
									>
										No jobs found.
									</Text>
								)}
							</Flex>
						</ScrollArea.Content>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar orientation="horizontal">
						<ScrollArea.Thumb />
					</ScrollArea.Scrollbar>
				</ScrollArea.Root>
			</Box>
		</Drawer.Header>
	);
}
