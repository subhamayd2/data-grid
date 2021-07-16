import React, { memo } from "react";
import { Box, makeStyles, TableSortLabel, Typography } from "@material-ui/core";
import { useDataGridContext } from "./DataGridContext";
import { useIntl } from "react-intl";
import { DragIndicator } from "@material-ui/icons";
import TableCell from "./TableCell";
import TableRow from "./TableRow";

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
    <div>
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
                component: "div",
                hideSortIcon: true,
                active: isSorted,
                direction: sortDirection,
              };
            }

            return (
              <Box {...column.getHeaderProps()} display="flex">
                <TableCell
                  style={{ flexGrow: 1, display: "inline" }}
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
    </div>
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

export default memo(TableHead);
