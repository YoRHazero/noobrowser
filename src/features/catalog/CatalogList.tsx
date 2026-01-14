import {
	Box,
	Group,
	IconButton,
	Pagination,
	Spinner,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
	type CatalogItemResponse,
	useCatalogQuery,
} from "@/hook/connection-hook";

interface CatalogListProps {
	selectedId: string | null;
	onSelect: (item: CatalogItemResponse) => void;
}

export function CatalogList({ selectedId, onSelect }: CatalogListProps) {
	const [page, setPage] = useState(1);
	const PAGE_SIZE = 20;

	const { data, isLoading, isError, error } = useCatalogQuery({
		page,
		pageSize: PAGE_SIZE,
		sortDesc: true,
	});

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
									const prevValue =
										pages[index - 1]?.type === "page"
											? pages[index - 1].value
											: "start";
									const nextValue =
										pages[index + 1]?.type === "page"
											? pages[index + 1].value
											: "end";
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
