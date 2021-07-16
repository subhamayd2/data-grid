import React from "react";
import {
  Box,
  makeStyles,
  TableCell,
  TableHead as CoreTableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core";
import { useDataGridContext } from "./DataGridContext";
import { useIntl } from "react-intl";
import { DragIndicator } from "@material-ui/icons";

const TableHead = () => {
  const { dragIndicatorWrapperStyle } = useStyles();
  const { formatMessage } = useIntl();
  const {
    headerGroups,
    toggleSortBy,
    dataGridProps: { sortable, onSort },
    state: { pageSize },
  } = useDataGridContext();

  const handleSort = (col) => () => {
    const { id, isSortedDesc, isSorted } = col;

    let isDesc = isSorted ? !isSortedDesc : false;

    toggleSortBy(id, isDesc);

    onSort({
      sortBy: id,
      direction: isDesc ? "desc" : "asc",
      page: 0,
      pageSize,
    });
  };

  return (
    <CoreTableHead>
      {headerGroups.map((headerGroup) => (
        <TableRow {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => {
            const { isSorted, isSortedDesc, canSort, canResize } = column;

            const sortDirection = isSortedDesc ? "desc" : "asc";
            const isColumnSortable = sortable && canSort;

            const SortWrapper = isColumnSortable ? TableSortLabel : Box;

            let sortWrapperProps = {};
            if (isColumnSortable) {
              sortWrapperProps = {
                hideSortIcon: true,
                active: isSorted,
                direction: sortDirection,
              };
            }

            return (
              <Box component="th" {...column.getHeaderProps()} display="flex">
                <TableCell
                  style={{ flexGrow: 1, display: "inline" }}
                  component="div"
                  sortDirection={isSorted ? sortDirection : false}
                  {...(isColumnSortable
                    ? column.getSortByToggleProps({
                        title: `${formatMessage({ id: "sort.by" })} ${
                          column.Header
                        }`,
                        onClick: handleSort(column),
                      })
                    : {})}
                >
                  <SortWrapper {...sortWrapperProps}>
                    <Typography variant="subtitle2" component="div">
                      {column.render("Header")}
                    </Typography>
                  </SortWrapper>
                </TableCell>
                {canResize && (
                  <Box
                    {...column.getResizerProps({
                      className: dragIndicatorWrapperStyle,
                    })}
                  >
                    <DragIndicator color="inherit" />
                  </Box>
                )}
              </Box>
            );
          })}
        </TableRow>
      ))}
    </CoreTableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  dragIndicatorWrapperStyle: {
    color: theme.palette.divider,
    position: "absolute",
    right: 0,
    top: 0,
  },
}));

export default TableHead;
