import {
	Box,
	Button,
	Dialog,
	HStack,
	IconButton,
	Link,
	NumberInput,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { LuExternalLink, LuSearch } from "react-icons/lu";
import { useState } from "react";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";
import { Tooltip } from "@/components/ui/tooltip";

interface NedSearchDialogProps {
	ra: number;
	dec: number;
}

export default function NedSearchDialog({ ra, dec }: NedSearchDialogProps) {
	const [radius, setRadius] = useState(2);
	// We'll control execution manually via refetch, so enabled is false initially
	const {
		data: results,
		isFetching,
		refetch,
	} = useNedSearch({
		ra,
		dec,
		radius,
		enabled: false,
	});

	const handleSearch = () => {
		refetch();
	};

	return (
		<Dialog.Root>
			<Tooltip content="NED Search">
				<Dialog.Trigger asChild>
					<IconButton
						aria-label="NED Search"
						size="xs"
						variant="ghost"
						colorPalette="blue"
						onClick={(e) => e.stopPropagation()}
					>
						<LuSearch size={14} />
					</IconButton>
				</Dialog.Trigger>
			</Tooltip>
			<Dialog.Backdrop />
			<Dialog.Positioner>
				<Dialog.Content onClick={(e) => e.stopPropagation()}>
					<Dialog.CloseTrigger />
					<Dialog.Header>
						<Dialog.Title>NED Search</Dialog.Title>
					</Dialog.Header>
					<Dialog.Body>
						<VStack gap={4} align="stretch">
							<HStack justify="space-between">
								<Text fontSize="sm" color="fg.muted">
									Search Radius (arcsec):
								</Text>
								<HStack>
									<NumberInput.Root
										size="sm"
										width="80px"
										value={radius.toString()}
										onValueChange={(e) => {
											const val = parseInt(e.value, 10);
											if (!Number.isNaN(val)) {
												setRadius(val);
											}
										}}
										min={1}
										max={30}
									>
										<NumberInput.Input />
									</NumberInput.Root>
									<Button
										size="sm"
										variant="solid"
										colorPalette="blue"
										loading={isFetching}
										onClick={handleSearch}
									>
										Search
									</Button>
								</HStack>
							</HStack>

							<Box
								maxH="400px"
								overflowY="auto"
								borderWidth="1px"
								borderColor="border.subtle"
								borderRadius="md"
								bg="bg.panel"
							>
								{results && results.length > 0 ? (
									<Table.Root size="sm" interactive stickyHeader>
										<Table.Header>
											<Table.Row>
												<Table.ColumnHeader>Object Name</Table.ColumnHeader>
												<Table.ColumnHeader textAlign="right">
													z
												</Table.ColumnHeader>
												<Table.ColumnHeader width="40px"></Table.ColumnHeader>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{results.map((result, idx) => (
												<Table.Row key={`${result.object_name}-${idx}`}>
													<Table.Cell>
														<Text truncate maxW="200px" fontSize="sm">
															{result.object_name}
														</Text>
													</Table.Cell>
													<Table.Cell textAlign="right" fontSize="sm">
														{result.redshift !== null
															? result.redshift.toFixed(4)
															: "-"}
													</Table.Cell>
													<Table.Cell>
														<Link
															href={result.url}
															target="_blank"
															rel="noreferrer"
															color="blue.400"
														>
															<LuExternalLink />
														</Link>
													</Table.Cell>
												</Table.Row>
											))}
										</Table.Body>
									</Table.Root>
								) : (
									<Box p={8} textAlign="center" color="fg.muted">
										{isFetching ? "Searching..." : "No results found."}
									</Box>
								)}
							</Box>
						</VStack>
					</Dialog.Body>
					<Dialog.Footer>
						<Dialog.CloseTrigger asChild>
							<Button variant="outline" size="sm">Close</Button>
						</Dialog.CloseTrigger>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog.Positioner>
		</Dialog.Root>
	);
}
