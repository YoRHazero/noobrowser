"use client";

import { Box, Link, Stack, Table, Text, useSlotRecipe } from "@chakra-ui/react";
import { ExternalLink } from "lucide-react";
import { nedResultsContentRecipe } from "./NedResultsContent.recipe";

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
	const recipe = useSlotRecipe({ recipe: nedResultsContentRecipe });
	const styles = recipe({ feedbackTone: isError ? "error" : "neutral" });

	return (
		<Stack css={styles.root}>
			<Text css={styles.title}>NED results</Text>

			<Box css={styles.panel}>
				{isFetching ? (
					<Box css={styles.emptyState}>
						<Text css={styles.message}>Searching NED...</Text>
					</Box>
				) : isError ? (
					<Box css={styles.emptyState}>
						<Text css={styles.message}>
							{errorMessage ?? "NED search failed."}
						</Text>
					</Box>
				) : isSuccess && results.length > 0 ? (
					<Table.Root size="sm" interactive stickyHeader css={styles.table}>
						<Table.Header>
							<Table.Row>
								<Table.ColumnHeader>Object</Table.ColumnHeader>
								<Table.ColumnHeader css={styles.numericHeader}>
									z
								</Table.ColumnHeader>
								<Table.ColumnHeader css={styles.actionHeader} />
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{results.map((result) => (
								<Table.Row
									key={`${result.objectName}-${result.ra}-${result.dec}`}
								>
									<Table.Cell>
										<Text css={styles.objectName}>{result.objectName}</Text>
									</Table.Cell>
									<Table.Cell css={styles.redshift}>
										{result.redshift !== null
											? result.redshift.toFixed(4)
											: "-"}
									</Table.Cell>
									<Table.Cell>
										<Link
											href={result.url}
											target="_blank"
											rel="noreferrer"
											css={styles.link}
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
					<Box css={styles.emptyState}>
						<Text css={styles.message}>
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
