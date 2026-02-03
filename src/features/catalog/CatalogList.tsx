import {
	Box,
	Group,
	HStack,
	IconButton,
	Pagination,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuTrash2, LuCopy } from "react-icons/lu";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@chakra-ui/react";
import {
	useCatalogQuery,
	useDeleteCatalogEntryMutation,
	type CatalogItemResponse,
} from "@/hooks/query/fit";

interface CatalogListProps {
	selectedId: string | null;
	onSelect: (item: CatalogItemResponse) => void;
}

function getSeparation(
	ra1: number,
	dec1: number,
	ra2: number,
	dec2: number,
): number {
	const ra1Rad = (ra1 * Math.PI) / 180;
	const dec1Rad = (dec1 * Math.PI) / 180;
	const ra2Rad = (ra2 * Math.PI) / 180;
	const dec2Rad = (dec2 * Math.PI) / 180;

	// Small angle approximation for speed, sufficient for 10 arcsec
	const dRa = (ra1Rad - ra2Rad) * Math.cos((dec1Rad + dec2Rad) / 2);
	const dDec = dec1Rad - dec2Rad;

	const distRad = Math.sqrt(dRa * dRa + dDec * dDec);
	return (distRad * 180 * 3600) / Math.PI; // convert to arcsec
}

export function CatalogList({ selectedId, onSelect }: CatalogListProps) {
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 20;
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const { data, isLoading, isError, error } = useCatalogQuery({
		page,
		pageSize: PAGE_SIZE,
		sortDesc: true,
	});

	const deleteMutation = useDeleteCatalogEntryMutation();

	const handleDeleteClick = (e: React.MouseEvent, itemId: string) => {
		e.stopPropagation();
		setPendingDeleteId(itemId);
	};

	const handleConfirmDelete = () => {
		if (pendingDeleteId) {
			deleteMutation.mutate({ sourceId: pendingDeleteId });
			setPendingDeleteId(null);
		}
	};

	const handleCancelDelete = () => {
		setPendingDeleteId(null);
	};

	// Calculate duplicates when data changes
	const duplicatesMap = useMemo(() => {
		if (!data) return new Map<string, string[]>();

		const map = new Map<string, string[]>();
		const items = data.items;

		for (let i = 0; i < items.length; i++) {
			const item1 = items[i];
			const dups: string[] = [];
			for (let j = 0; j < items.length; j++) {
				if (i === j) continue;
				const item2 = items[j];
				const sep = getSeparation(item1.ra, item1.dec, item2.ra, item2.dec);
				if (sep <= 10) {
					dups.push(item2.id);
				}
			}
			if (dups.length > 0) {
				map.set(item1.id, dups);
			}
		}
		return map;
	}, [data]);

	if (isLoading) {
		return (
			<Box p={4} display="flex" justifyContent="center">
				<Spinner />
			</Box>
		);
	}

	if (isError) {
		return (
			<Box p={4} color="red.500">
				Error loading catalog: {error?.message}
			</Box>
		);
	}

	if (!data) return null;

	return (
		<Stack gap={4} h="full">
			{/* Delete Confirmation Dialog */}
			{pendingDeleteId && (
				<Box
					p={3}
					bg="red.50"
					borderWidth="1px"
					borderColor="red.200"
					borderRadius="md"
				>
					<Text fontSize="sm" mb={2}>
						Delete entry <strong>{pendingDeleteId}</strong>?
					</Text>
					<HStack gap={2}>
						<IconButton
							aria-label="Confirm delete"
							size="xs"
							colorPalette="red"
							onClick={handleConfirmDelete}
							loading={deleteMutation.isPending}
						>
							<LuTrash2 />
						</IconButton>
						<Text
							fontSize="xs"
							color="gray.600"
							cursor="pointer"
							onClick={handleCancelDelete}
						>
							Cancel
						</Text>
					</HStack>
				</Box>
			)}

			<Stack gap={0} flex={1} overflowY="auto">
				{data.items.map((item) => (
					<Box
						key={item.id}
						p={3}
						cursor="pointer"
						bg={selectedId === item.id ? "bg.subtle" : "transparent"}
						_hover={{ bg: "bg.subtle" }}
						onClick={() => onSelect(item)}
						borderBottomWidth="1px"
						borderColor="border.muted"
					>
						<HStack justify="space-between" align="start">
							<Box flex={1} minW={0}>
								<HStack gap={2}>
									<Text fontWeight="medium" truncate>
										{item.id}
									</Text>
									{duplicatesMap.has(item.id) && (
										<Tooltip
											content={`Close to: ${duplicatesMap.get(item.id)?.join(", ")}`}
										>
											<Badge colorPalette="orange" size="xs">
												<LuCopy style={{ marginRight: 2 }} />
												Duplicated
											</Badge>
										</Tooltip>
									)}
								</HStack>
								<Text fontSize="sm" color="fg.muted">
									z: {item.z?.toFixed(3) ?? "N/A"}
								</Text>
								<Text fontSize="xs" color="fg.muted" truncate>
									{item.ref_basename}
								</Text>
							</Box>
							<IconButton
								aria-label="Delete entry"
								size="xs"
								variant="ghost"
								colorPalette="red"
								onClick={(e) => handleDeleteClick(e, item.id)}
							>
								<LuTrash2 />
							</IconButton>
						</HStack>
					</Box>
				))}
			</Stack>

			<Box p={2} borderTopWidth="1px" borderColor="border.muted">
				<Pagination.Root
					count={data.total}
					pageSize={PAGE_SIZE}
					page={page}
					onPageChange={(e) => setPage(e.page)}
					siblingCount={1}
				>
					<Group gap={2} justify="center" w="full">
						<Pagination.PrevTrigger asChild>
							<IconButton variant="ghost" size="sm">
								<LuChevronLeft />
							</IconButton>
						</Pagination.PrevTrigger>

						<Pagination.Context>
							{({ pages }) =>
								pages.map((page, index) => {
									if (page.type === "page") {
										return (
											<Pagination.Item key={page.value} {...page} asChild>
												<IconButton
													variant={
														page.value === data.page ? "outline" : "ghost"
													}
													size="sm"
												>
													{page.value}
												</IconButton>
											</Pagination.Item>
										);
									}
									const prevPage = pages[index - 1];
									const nextPage = pages[index + 1];
									const prevValue =
										prevPage?.type === "page" ? prevPage.value : "start";
									const nextValue =
										nextPage?.type === "page" ? nextPage.value : "end";
									return (
										<Pagination.Ellipsis
											key={`ellipsis-${prevValue}-${nextValue}`}
											index={index}
										/>
									);
								})
							}
						</Pagination.Context>

						<Pagination.NextTrigger asChild>
							<IconButton variant="ghost" size="sm">
								<LuChevronRight />
							</IconButton>
						</Pagination.NextTrigger>
					</Group>
				</Pagination.Root>
			</Box>
		</Stack>
	);
}
