import React from "react";
import { TablePagination } from "@material-ui/core";
import { useDataGridContext } from "./DataGridContext";
import PaginationActions from "./PaginationActions";

const Pagination = () => {
  const {
    dataGridProps: {
      recordCount,
      disablePaginationInput,
      onPageChange,
      rowsPerPageOptions,
    },
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useDataGridContext();

  const handlePageSizeChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    gotoPage(0);
    onPageChange({ page: 0, pageSize: newPageSize });
  };

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={rowsPerPageOptions}
      count={recordCount}
      rowsPerPage={pageSize}
      page={pageIndex}
      SelectProps={{
        inputProps: { "aria-label": "rows per page" },
        disabled: disablePaginationInput,
      }}
      labelDisplayedRows={({ count }) => `Total record(s): ${count}`}
      ActionsComponent={PaginationActions}
      onRowsPerPageChange={handlePageSizeChange}
      // We are handling the page change. Need to pass empty func here, since it is required by Mui
      onPageChange={() => {}}
    />
  );
};

export default Pagination;
