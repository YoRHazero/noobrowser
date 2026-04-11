import { Box, Link, Stack, Table, Text } from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";

interface NedResultsContentProps {
	isFetching: boolean;
	isSuccess: boolean;
	isError: boolean;
	errorMessage: string | null;
	results: Array<{
		objectName: string;
		ra: number;
		dec: number;
		redshift: number | null;
		url: string;
	}>;
}

export function NedResultsContent({
	isFetching,
	isSuccess,
	isError,
	errorMessage,
	results,
}: NedResultsContentProps) {
	return (
		<Stack gap={3}>
			<Text
				fontSize="xs"
				fontWeight="semibold"
				letterSpacing="normal"
				textTransform="none"
				color="white"
			>
				NED results
			</Text>

			<Box
				maxH="320px"
				overflowY="auto"
				borderWidth="1px"
				borderColor="whiteAlpha.180"
				borderRadius="md"
				bg="whiteAlpha.60"
			>
				{isFetching ? (
					<Box p={6} textAlign="center">
						<Text fontSize="sm" color="whiteAlpha.760">
							Searching NED...
						</Text>
					</Box>
				) : isError ? (
					<Box p={6} textAlign="center">
						<Text fontSize="sm" color="red.200">
							{errorMessage ?? "NED search failed."}
						</Text>
					</Box>
				) : isSuccess && results.length > 0 ? (
					<Table.Root size="sm" interactive stickyHeader>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>Object</Table.ColumnHeader>
								<Table.ColumnHeader textAlign="right">z</Table.ColumnHeader>
								<Table.ColumnHeader width="40px" />
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{results.map((result) => (
								<Table.Row
									key={`${result.objectName}-${result.ra}-${result.dec}`}
								>
									<Table.Cell>
										<Text truncate maxW="220px" fontSize="sm" color="white">
											{result.objectName}
										</Text>
									</Table.Cell>
									<Table.Cell
										textAlign="right"
										fontSize="sm"
										color="whiteAlpha.820"
									>
										{result.redshift !== null
											? result.redshift.toFixed(4)
											: "-"}
									</Table.Cell>
									<Table.Cell>
										<Link
											href={result.url}
											target="_blank"
											rel="noreferrer"
											color="cyan.300"
											aria-label={`Open ${result.objectName} in NED`}
										>
											<ExternalLink size={14} />
										</Link>
									</Table.Cell>
								</Table.Row>
							))}
						</Table.Body>
					</Table.Root>
				) : (
					<Box p={6} textAlign="center">
						<Text fontSize="sm" color="whiteAlpha.760" lineHeight={1.6}>
							{isSuccess
								? "No NED objects were found within the current radius."
								: "Click the NED icon to search the active source."}
						</Text>
					</Box>
				)}
			</Box>
		</Stack>
	);
}
