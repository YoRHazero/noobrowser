import {
	Badge,
	Box,
	CloseButton,
	Drawer,
	Flex,
	Heading,
	HStack,
	IconButton,
	Stack,
	Text,
} from "@chakra-ui/react";
import { Ban, CheckCircle, Clock, Info, Trash2 } from "lucide-react";
import type { FitJobResponse } from "@/hooks/query/fit/schemas";

interface GrismFitJobDrawerHeaderProps {
	jobs: FitJobResponse[];
	selectedJobId: string | null;
	onSelectJob: (id: string, status: string) => void;
	onRemoveJob: (id: string) => void;
}

export default function GrismFitJobDrawerHeader({
	jobs,
	selectedJobId,
	onSelectJob,
	onRemoveJob,
}: GrismFitJobDrawerHeaderProps) {
	// Sort logic handled in parent or here? Parent passed sorted?
	// It's better if parent passes raw simple list or pre-sorted.
	// Let's assume parent passes `jobs` from store and we display them.
	// Re-sorting here for safety or reusing the list.
	const sortedJobs = [...jobs].reverse();

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle size={12} />;
			case "processing":
				return <Clock size={12} className="animate-pulse" />;
			case "pending":
				return <Clock size={12} />;
			case "failed":
				return <Ban size={12} />;
			default:
				return <Info size={12} />;
		}
	};

	const getStatusPalette = (status: string) => {
		switch (status) {
			case "completed":
				return "green";
			case "processing":
				return "blue";
			case "pending":
				return "gray";
			case "failed":
				return "red";
			default:
				return "gray";
		}
	};

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

			{/* Job List Header - Replaced ScrollArea with Box+overflow */}
			<Box mt={4} mb={2}>
				<Box h="120px" overflowY="auto" pr={2} className="custom-scrollbar">
					<Stack gap={2}>
						{sortedJobs.map((job) => {
							const isSelected = selectedJobId === job.job_id;
							const isCompleted = job.status === "completed";

							return (
								<Flex
									key={job.job_id}
									justify="space-between"
									align="center"
									bg={isSelected ? "cyan.900/30" : "whiteAlpha.50"}
									borderColor={isSelected ? "cyan.500" : "whiteAlpha.100"}
									borderWidth="1px"
									borderRadius="md"
									p={2}
									cursor="pointer"
									_hover={{
										borderColor: isCompleted ? "cyan.400" : undefined,
										bg: isSelected ? "cyan.900/40" : "whiteAlpha.100",
									}}
									onClick={() => onSelectJob(job.job_id, job.status)}
									transition="all 0.2s"
								>
									<HStack gap={3}>
										<Badge
											variant={job.status === "processing" ? "subtle" : "solid"}
											colorPalette={getStatusPalette(job.status)}
											size="sm"
										>
											<HStack gap={1}>
												{getStatusIcon(job.status)}
												<Text>{job.status.toUpperCase()}</Text>
											</HStack>
										</Badge>
										<Text fontSize="xs" fontFamily="mono" color="gray.400">
											ID: {job.job_id.slice(0, 8)}
										</Text>
									</HStack>

									{(job.status === "completed" || job.status === "failed") && (
										<IconButton
											size="xs"
											variant="ghost"
											colorPalette="red"
											aria-label="Delete job"
											onClick={(e) => {
												e.stopPropagation();
												onRemoveJob(job.job_id);
											}}
										>
											<Trash2 size={14} />
										</IconButton>
									)}
								</Flex>
							);
						})}
						{sortedJobs.length === 0 && (
							<Text color="gray.500" fontSize="xs" textAlign="center" py={2}>
								No jobs found.
							</Text>
						)}
					</Stack>
				</Box>
			</Box>
		</Drawer.Header>
	);
}
