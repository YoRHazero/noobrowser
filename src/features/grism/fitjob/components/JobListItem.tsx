import { Badge, Flex, HStack, Text } from "@chakra-ui/react";
import { Ban, CheckCircle, Clock, Info } from "lucide-react";
import type { FitJobStatusResponse } from "@/hooks/query/fit";

interface JobListItemProps {
	job: FitJobStatusResponse;
	isSelected: boolean;
	onSelect: (id: string) => void;
}

export function JobListItem({ job, isSelected, onSelect }: JobListItemProps) {
	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
			case "saved":
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
			case "saved":
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
		<Flex
			flex="0 0 auto"
			minW="200px"
			justify="space-between"
			align="center"
			bg={isSelected ? "cyan.900/30" : "whiteAlpha.50"}
			borderColor={isSelected ? "cyan.500" : "whiteAlpha.100"}
			borderWidth="1px"
			borderRadius="md"
			p={2}
			cursor="pointer"
			_hover={{
				borderColor: "cyan.400",
				bg: isSelected ? "cyan.900/40" : "whiteAlpha.100",
			}}
			onClick={() => onSelect(job.job_id)}
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
		</Flex>
	);
}
