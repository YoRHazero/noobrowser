import {
	Box,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	Stack,
	ScrollArea,
	Spinner,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { useFitJobList } from "./hooks/useFitJobList";
import { JobListItem } from "./components/JobListItem";
import { fitJobDrawerRecipe } from "./recipes/fit-job-drawer.recipe";

export default function FitJobList() {
	const { jobs, selectedJobId, onSelect, isLoading, error } = useFitJobList();
	const sortedJobs = jobs;

	const recipe = useSlotRecipe({ recipe: fitJobDrawerRecipe });
	const styles = recipe();

	return (
		<Drawer.Header css={styles.header}>
			<Stack>
				<HStack justify="space-between">
					<Heading size="sm" css={styles.heading} whiteSpace="nowrap">
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
										<Flex w="full" py={2} align="center" justify="center">
											<Spinner size="sm" color="cyan.300" />
										</Flex>
									)}
									{!!error && (
										<Text
											css={styles.errorText}
											textAlign="center"
											py={2}
											w="full"
										>
											{error}
										</Text>
									)}
									{sortedJobs.length === 0 && !isLoading && !error && (
										<Text
											color="fg.muted"
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
			</Stack>
		</Drawer.Header>
	);
}
