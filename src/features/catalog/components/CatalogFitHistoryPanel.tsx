import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	IconButton,
	Stack,
	Text,
} from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { useSelectedFitJob } from "../hooks/useSelectedFitJob";

export function CatalogFitHistoryPanel() {
	const { selectedSource, fitHistory, selectedFitJobId, setSelectedFitJobId } =
		useSelectedFitJob();

	if (!selectedSource) {
		return (
			<Box
				p={4}
				borderWidth="1px"
				borderColor="border.muted"
				borderRadius="lg"
				bg="bg.surface"
			>
				<Text color="fg.muted">Select a source to view fit history.</Text>
			</Box>
		);
	}

	return (
		<Box
			p={4}
			borderWidth="1px"
			borderColor="border.muted"
			borderRadius="lg"
			bg="bg.surface"
		>
			<HStack justify="space-between" mb={3}>
				<Heading size="sm">Fit History</Heading>
				<Button size="xs" variant="ghost" disabled>
					Delete Selected
				</Button>
			</HStack>

			{fitHistory.length === 0 ? (
				<Text color="fg.muted">No fit results available.</Text>
			) : (
				<Stack gap={2} maxH="280px" overflowY="auto">
					{fitHistory.map((entry) => {
						const isSelected = entry.job_id === selectedFitJobId;
						const configNames = Object.keys(entry.trace_url_dict ?? {});
						return (
							<Box
								key={entry.job_id}
								p={3}
								borderWidth="1px"
								borderColor={isSelected ? "blue.300" : "border.muted"}
								borderRadius="md"
								bg={isSelected ? "blue.50" : "transparent"}
								cursor="pointer"
								onClick={() => setSelectedFitJobId(entry.job_id)}
							>
								<HStack justify="space-between" align="start">
									<Box flex={1} minW={0}>
										<HStack gap={2} flexWrap="wrap">
											<Text fontSize="sm" fontWeight="medium" truncate>
												{entry.created_at ?? entry.job_id}
											</Text>
											{entry.best_model_name && (
												<Badge size="xs" variant="surface">
													{entry.best_model_name}
												</Badge>
											)}
											{isSelected && (
												<Badge size="xs" colorPalette="blue">
													Selected
												</Badge>
											)}
										</HStack>
										<Text fontSize="xs" color="fg.muted">
											Job ID: {entry.job_id}
										</Text>
										<HStack gap={1} mt={2} flexWrap="wrap">
											<Text fontSize="xs" color="fg.muted">
												Fit Configurations:
											</Text>
											{configNames.length > 0 ? (
												configNames.map((name) => (
													<Badge key={name} size="xs" variant="outline">
														{name}
													</Badge>
												))
											) : (
												<Badge size="xs" variant="outline">
													None
												</Badge>
											)}
										</HStack>
									</Box>
									<IconButton
										aria-label="Delete fit result"
										size="xs"
										variant="ghost"
										disabled
										onClick={(event) => event.stopPropagation()}
									>
										<LuTrash2 />
									</IconButton>
								</HStack>
							</Box>
						);
					})}
				</Stack>
			)}
		</Box>
	);
}
