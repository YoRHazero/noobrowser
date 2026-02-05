import {
	Box,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	ScrollArea,
	Spinner,
	Text,
} from "@chakra-ui/react";
import { useJobListView } from "../hooks/useJobListView";
import { JobListItem } from "./JobListItem";

export default function JobListView() {
	const { jobs, selectedJobId, onSelect, isLoading, error } = useJobListView();
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
										onSelect={onSelect}
									/>
								))}
								{isLoading && (
									<Flex
										w="full"
										py={2}
										align="center"
										justify="center"
									>
										<Spinner size="sm" color="cyan.300" />
									</Flex>
								)}
								{!!error && (
									<Text
										color="red.400"
										fontSize="xs"
										textAlign="center"
										py={2}
										w="full"
									>
										{error}
									</Text>
								)}
								{sortedJobs.length === 0 && !isLoading && !error && (
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
