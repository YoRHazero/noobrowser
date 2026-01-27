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
import { useState } from "react";
import { LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu";
import {
	useCatalogQuery,
	useDeleteCatalogEntryMutation,
	type CatalogItemResponse,
} from "@/hooks/query/fit";

interface CatalogListProps {
	selectedId: string | null;
	onSelect: (item: CatalogItemResponse) => void;
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
								<Text fontWeight="medium" truncate>
									{item.id}
								</Text>
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
