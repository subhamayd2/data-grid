import React from "react";
import {
  Box,
  Divider,
  makeStyles,
  TableCell,
  TableHead as CoreTableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@material-ui/core";
import { useDataGridContext } from "./DataGridContext";
import { useIntl } from "react-intl";
import { getAlignment } from "./helpers";

const TableHead = () => {
  const { dragIndicatorWrapperStyle, headerContentStyle, tableCellStyle } =
    useStyles();
  const { formatMessage } = useIntl();
  const {
    headerGroups,
    toggleSortBy,
    dataGridProps: { sortable, onSort },
    state: { pageSize },
  } = useDataGridContext();

  const handleSort = (col) => (e) => {
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

            const ContentWrapper = isColumnSortable ? TableSortLabel : Box;

            let contentWrapperProps = {
              className: headerContentStyle,
            };
            if (isColumnSortable) {
              contentWrapperProps = {
                ...contentWrapperProps,
                hideSortIcon: true,
                active: isSorted,
                direction: sortDirection,
              };
            }

            const columnSortProps = column.getSortByToggleProps({
              title: `${formatMessage({ id: "sort.by" })} ${column.Header}`,
              onClick: handleSort(column),
            });

            return (
              <TableCell
                {...column.getHeaderProps({ className: tableCellStyle })}
                sortDirection={isSorted ? sortDirection : false}
                align={column.align}
              >
                <Box display="flex" alignItems="stretch" width="100%">
                  <ContentWrapper
                    {...(isColumnSortable ? columnSortProps : {})}
                    {...contentWrapperProps}
                    style={{ justifyContent: getAlignment(column.align) }}
                  >
                    <Typography variant="subtitle2" component="div">
                      {column.render("Header")}
                    </Typography>
                  </ContentWrapper>
                  {canResize && (
                    <div
                      {...column.getResizerProps({
                        className: dragIndicatorWrapperStyle,
                        title: `${formatMessage({ id: "resize" })} ${
                          column.Header
                        }`,
                      })}
                    >
                      <Divider orientation="vertical" />
                    </div>
                  )}
                </Box>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </CoreTableHead>
  );
};

const useStyles = makeStyles((theme) => ({
  dragIndicatorWrapperStyle: {
    width: theme.spacing(1),
    height: theme.spacing(2),
    display: "flex",
    flexDirection: "row-reverse",
    marginLeft: "auto",
    overflow: "hidden",
    "&:hover > hr, &:active > hr": {
      width: theme.spacing(0.25),
      backgroundColor: theme.palette.primary.main,
    },
  },
  headerContentStyle: {
    flexGrow: 1,
    display: "flex",
  },
  tableCellStyle: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.75, 1),
  },
}));

export default TableHead;
