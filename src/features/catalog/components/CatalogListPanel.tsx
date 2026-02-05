import {
	Badge,
	Box,
	Button,
	Group,
	HStack,
	IconButton,
	Pagination,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { LuChevronLeft, LuChevronRight, LuTrash2 } from "react-icons/lu";
import { useCatalogList, useDeleteCatalogEntry } from "@/hooks/query/catalog";
import { useCatalogPagination } from "../hooks/useCatalogPagination";
import { useCatalogSelection } from "../hooks/useCatalogSelection";

export function CatalogListPanel() {
	const { page, pageSize, sortDesc, user, setPage } = useCatalogPagination();
	const {
		selectedSourceId,
		toggleSelectedSource,
		clearSelection,
		syncSelectedSource,
	} = useCatalogSelection();
	const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

	const { data, isLoading, isError, error } = useCatalogList({
		page,
		page_size: pageSize,
		sort_desc: sortDesc,
		user: user ?? undefined,
	});

	const deleteMutation = useDeleteCatalogEntry();

	useEffect(() => {
		if (!data || !selectedSourceId) return;
		const match = data.items.find((item) => item.id === selectedSourceId);
		if (match) syncSelectedSource(match);
	}, [data, selectedSourceId, syncSelectedSource]);

	const totalLabel = useMemo(() => {
		if (!data) return "";
		return `${data.total} sources`;
	}, [data]);

	const handleConfirmDelete = () => {
		if (!pendingDeleteId) return;
		deleteMutation.mutate(pendingDeleteId, {
			onSuccess: () => {
				if (selectedSourceId === pendingDeleteId) {
					clearSelection();
				}
			},
			onSettled: () => setPendingDeleteId(null),
		});
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
			<Box>
				<Text fontSize="sm" color="fg.muted">
					Catalog
				</Text>
				<HStack justify="space-between">
					<Text fontWeight="semibold">Sources</Text>
					<Text fontSize="xs" color="fg.muted">
						{totalLabel}
					</Text>
				</HStack>
			</Box>

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
						<Button
							size="xs"
							colorPalette="red"
							onClick={handleConfirmDelete}
							loading={deleteMutation.isPending}
						>
							Confirm
						</Button>
						<Button
							size="xs"
							variant="ghost"
							onClick={() => setPendingDeleteId(null)}
						>
							Cancel
						</Button>
					</HStack>
				</Box>
			)}

			<Stack gap={0} flex={1} overflowY="auto">
				{data.items.map((item) => {
					const isSelected = selectedSourceId === item.id;
					return (
						<Box
							key={item.id}
							p={3}
							cursor="pointer"
							bg={isSelected ? "bg.subtle" : "transparent"}
							_hover={{ bg: "bg.subtle" }}
							onClick={() => toggleSelectedSource(item)}
							borderBottomWidth="1px"
							borderColor="border.muted"
						>
							<HStack justify="space-between" align="start">
								<Box flex={1} minW={0}>
									<HStack gap={2}>
										<Text fontWeight="medium" truncate>
											{item.id}
										</Text>
										{isSelected && (
											<Badge size="xs" colorPalette="blue">
												Selected
											</Badge>
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
									onClick={(event) => {
										event.stopPropagation();
										setPendingDeleteId(item.id);
									}}
								>
									<LuTrash2 />
								</IconButton>
							</HStack>
						</Box>
					);
				})}
			</Stack>

			<Box p={2} borderTopWidth="1px" borderColor="border.muted">
				<Pagination.Root
					count={data.total}
					pageSize={pageSize}
					page={page}
					onPageChange={(event) => setPage(event.page)}
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
								pages.map((pageInfo, index) => {
									if (pageInfo.type === "page") {
										return (
											<Pagination.Item
												key={pageInfo.value}
												{...pageInfo}
												asChild
											>
												<IconButton
													variant={
														pageInfo.value === data.page ? "outline" : "ghost"
													}
													size="sm"
												>
													{pageInfo.value}
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
