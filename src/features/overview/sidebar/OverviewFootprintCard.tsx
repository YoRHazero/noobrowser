import {
	Box,
	Card,
	HStack,
	Popover,
	Portal,
	Stack,
	Text,
	useSlotRecipe,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import type { OverviewFootprintRecord } from "@/features/overview/utils/types";
import { overviewFootprintCardRecipe } from "./recipes/overview-footprint-card.recipe";

export interface OverviewFootprintCardProps {
	footprint: OverviewFootprintRecord;
	isSelected: boolean;
	precision: number;
	onClick: () => void;
}

export function OverviewFootprintCard({
	footprint,
	isSelected,
	precision,
	onClick,
}: OverviewFootprintCardProps) {
	const recipe = useSlotRecipe({ recipe: overviewFootprintCardRecipe });
	const [isFilesOpen, setIsFilesOpen] = useState(false);
	const styles = recipe({
		selected: isSelected,
		filesOpen: isFilesOpen,
	});
	const includedFiles = Array.isArray(footprint.meta.included_files)
		? footprint.meta.included_files.filter(
				(file): file is string => typeof file === "string" && file.length > 0,
			)
		: [];

	return (
		<Card.Root
			size="sm"
			role="button"
			tabIndex={0}
			aria-pressed={isSelected}
			css={styles.root}
			onClick={onClick}
			onKeyDown={(event) => {
				if (event.key !== "Enter" && event.key !== " ") {
					return;
				}

				event.preventDefault();
				onClick();
			}}
		>
			<Card.Body css={styles.body}>
				<Stack gap={1.5}>
					<Text css={styles.title}>
						Footprint {footprint.id}
					</Text>
					<Text css={styles.coordinate}>
						RA: {footprint.center.ra.toFixed(precision)} Dec:{" "}
						{footprint.center.dec.toFixed(precision)}
					</Text>
					{includedFiles.length > 0 ? (
						<Popover.Root
							open={isFilesOpen}
							onOpenChange={(details) => setIsFilesOpen(details.open)}
							positioning={{
								placement: "bottom-start",
								sameWidth: true,
								offset: { mainAxis: 6, crossAxis: 0 },
							}}
							lazyMount
							unmountOnExit
						>
							<Popover.Trigger asChild>
								<Box
									as="button"
									css={styles.filesTrigger}
									onClick={(event) => event.stopPropagation()}
									onKeyDown={(event) => event.stopPropagation()}
								>
									<HStack justify="space-between" gap={3}>
										<Text css={styles.filesTriggerLabel}>
											Files ({includedFiles.length})
										</Text>
										<Box as="span" css={styles.filesTriggerIcon}>
											{isFilesOpen ? <FiChevronUp /> : <FiChevronDown />}
										</Box>
									</HStack>
								</Box>
							</Popover.Trigger>
							<Portal>
								<Popover.Positioner>
									<Popover.Content
										css={styles.popoverContent}
										onClick={(event) => event.stopPropagation()}
										onKeyDown={(event) => event.stopPropagation()}
									>
										<Box css={styles.popoverBody}>
											<Stack gap={1.5}>
												{includedFiles.map((file) => (
													<Text key={file} css={styles.fileItem}>
														{file}
													</Text>
												))}
											</Stack>
										</Box>
									</Popover.Content>
								</Popover.Positioner>
							</Portal>
						</Popover.Root>
					) : (
						<Text css={styles.emptyFiles}>
							Files (0)
						</Text>
					)}
				</Stack>
			</Card.Body>
		</Card.Root>
	);
}
