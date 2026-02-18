import { useCatalogStore } from "../store/catalog-store";
import { useCatalogList } from "@/hooks/query/catalog";
import { useShallow } from "zustand/react/shallow";

export function useCatalogTable() {
  /* -------------------------------------------------------------------------- */
  /*                                Access Store                                */
  /* -------------------------------------------------------------------------- */
  const {
    page,
    pageSize,
    sortDesc,
    user,
    setPage,
    setPageSize,
    setSortDesc,
    setUser,
    setSelectedSource,
    selectedSourceId,
  } = useCatalogStore(
    useShallow((state) => ({
      page: state.page,
      pageSize: state.pageSize,
      sortDesc: state.sortDesc,
      user: state.user,
      setPage: state.setPage,
      setPageSize: state.setPageSize,
      setSortDesc: state.setSortDesc,
      setUser: state.setUser,
      setSelectedSource: state.setSelectedSource,
      selectedSourceId: state.selectedSourceId,
    })),
  );

  /* -------------------------------------------------------------------------- */
  /*                              Mutations/Query                               */
  /* -------------------------------------------------------------------------- */
  const query = useCatalogList({
    page,
    pageSize,
    sortDesc,
    user: user ?? undefined,
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Handle                                   */
  /* -------------------------------------------------------------------------- */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  const handleSortChange = () => {
    setSortDesc(!sortDesc);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Return                                   */
  /* -------------------------------------------------------------------------- */
  return {
    query,
    page,
    pageSize,
    sortDesc,
    user,
    selectedSourceId,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    setUser,
    setSelectedSource,
  };
}
