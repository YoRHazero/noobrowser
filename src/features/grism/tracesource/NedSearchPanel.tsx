import { useState } from "react";
import {
	Box,
	Button,
	Collapsible,
	HStack,
	Link,
	NumberInput,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import { LuExternalLink, LuSearch } from "react-icons/lu";
import { useNedSearch } from "@/hooks/query/source/useNedSearch";

interface NedSearchPanelProps {
	ra: number;
	dec: number;
}

export default function NedSearchPanel({ ra, dec }: NedSearchPanelProps) {
	const [radius, setRadius] = useState(2);
	const [isSearching, setIsSearching] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const { data: results, isFetching, refetch } = useNedSearch({
		ra,
		dec,
		radius,
		enabled: isSearching,
	});

	const handleSearch = () => {
		setIsSearching(true);
		if (!isOpen) setIsOpen(true);
		// Force refetch if already enabled but parameters changed or re-triggered
		refetch();
	};

	return (
		<Box borderTopWidth="1px" borderColor="border.subtle" p={4} bg="bg.subtle">
			<VStack gap={4} align="stretch">
				<HStack justify="space-between">
					<Text fontWeight="medium" fontSize="sm">
						NED Search
					</Text>
					<HStack>
						<Text fontSize="xs" color="fg.muted">
							Radius (arcsec):
						</Text>
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
							<LuSearch /> Search
						</Button>
					</HStack>
				</HStack>

				<Collapsible.Root open={isOpen} onOpenChange={(e: { open: boolean }) => setIsOpen(e.open)}>
					<Collapsible.Content>
						<Box
							maxH="300px"
							overflowY="auto"
							borderWidth="1px"
							borderColor="border.subtle"
							borderRadius="md"
							bg="bg.panel"
						>
							{results && results.length > 0 ? (
								<Table.Root size="sm" interactive>
									<Table.Header>
										<Table.Row>
											<Table.ColumnHeader>Object Name</Table.ColumnHeader>
											<Table.ColumnHeader textAlign="right">
												Redshift
											</Table.ColumnHeader>
											<Table.ColumnHeader width="40px"></Table.ColumnHeader>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										{results.map((result, idx) => (
											<Table.Row key={`${result.object_name}-${idx}`}>
												<Table.Cell>
													<Text truncate maxW="150px">
														{result.object_name}
													</Text>
												</Table.Cell>
												<Table.Cell textAlign="right">
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
								<Box p={4} textAlign="center" color="fg.muted">
									{isFetching ? "Searching..." : "No results found."}
								</Box>
							)}
						</Box>
					</Collapsible.Content>
				</Collapsible.Root>
			</VStack>
		</Box>
	);
}
