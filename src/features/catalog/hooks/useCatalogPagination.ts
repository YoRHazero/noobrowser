import { useCatalogStore } from "../store/catalog-store";

export function useCatalogPagination() {
	const page = useCatalogStore((state) => state.page);
	const pageSize = useCatalogStore((state) => state.pageSize);
	const sortDesc = useCatalogStore((state) => state.sortDesc);
	const user = useCatalogStore((state) => state.user);
	const setPage = useCatalogStore((state) => state.setPage);
	const setPageSize = useCatalogStore((state) => state.setPageSize);
	const setSortDesc = useCatalogStore((state) => state.setSortDesc);
	const setUser = useCatalogStore((state) => state.setUser);

	return {
		page,
		pageSize,
		sortDesc,
		user,
		setPage,
		setPageSize,
		setSortDesc,
		setUser,
	};
}
