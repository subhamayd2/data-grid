import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  useTable,
  usePagination,
  useSortBy,
  useResizeColumns,
  useBlockLayout,
} from "react-table";
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@material-ui/core";
import Pagination from "./Pagination";
import { DataGridProvider } from "./DataGridContext";
import { useControlledProps } from "./helpers";
import TableHead from "./TableHead";
import { useIntl } from "react-intl";
import { isEmpty } from "lodash";

/**
 * DataGrid component
 */
const DataGrid = (props) => {
  const { paperWrapper, tableStyle, tableFooterStyle } = useStyles();
  const { data, children, page, pageSize, recordCount, sortable, dense } =
    props;
  const { formatMessage } = useIntl();

  const columns = useMemo(
    () =>
      React.Children.map(children, (child, index) => ({
        columnIndex: index,
        ...child.props,
        Header: isEmpty(child.props.Header)
          ? ""
          : formatMessage({ id: child.props.Header }),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const tableInstance = useTable(
    {
      // Table options
      columns,
      data,
      // Pagination options
      initialState: {
        pageIndex: page,
        pageSize,
      },
      manualPagination: true,
      pageCount: -1,
      // Sorting options
      manualSortBy: true,
      defaultCanSort: sortable,
      disableMultiSort: true,
      disableSortRemove: true,
    },
    useResizeColumns,
    useBlockLayout,
    useSortBy,
    usePagination
  );

  /**
   * Make DataGrid controlled component
   * Update the DataGrid page/pageSize, when props changed
   */
  useControlledProps({ page, pageSize, tableInstance });

  const {
    prepareRow,
    page: tablePage,
    getTableProps,
    getTableBodyProps,
    state: { pageSize: statePageSize },
  } = tableInstance;

  const pageCount = useMemo(
    () => Math.ceil(recordCount / statePageSize),
    [statePageSize, recordCount]
  );

  return (
    <DataGridProvider
      value={{ ...tableInstance, pageCount, dataGridProps: props }}
    >
      <TableContainer component={Paper} className={paperWrapper}>
        <Table
          size={dense ? "small" : null}
          {...getTableProps({ className: tableStyle })}
        >
          <TableHead />
          <TableBody {...getTableBodyProps()}>
            {tablePage.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell
                        {...cell.getCellProps({
                          style: {
                            textOverflow: "ellipsis",
                            overflowX: "hidden",
                          },
                        })}
                      >
                        <Typography variant="inherit" noWrap>
                          {cell.render("Cell")}
                        </Typography>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div component="div" className={tableFooterStyle}>
          <Paper>
            <Pagination />
          </Paper>
        </div>
      </TableContainer>
    </DataGridProvider>
  );
};

const useStyles = makeStyles((theme) => ({
  paperWrapper: {
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  tableStyle: {
    flex: 1,
  },
  tableFooterStyle: {
    position: "sticky",
    bottom: 0,
  },
}));

DataGrid.propTypes = {
  /**
   * Array of data to be displayed
   *
   * @param {object[]} data
   */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Specify the `DataGrid` columns
   *
   * `<Column />`
   */
  children: PropTypes.node.isRequired,
  /**
   * The current page of the `DataGrid` to display
   *
   * @param {int} page
   * @default 0
   */
  /**
   * Make the rows more compact
   *
   * @param {boolean} dense
   */
  dense: PropTypes.bool,
  page: PropTypes.number,
  /**
   * The number of rows of `DataGrid` to display
   *
   * @param {int} pageSize
   * @default 10
   */
  pageSize: PropTypes.number,
  /**
   * The total number of rows available
   *
   * @param {int} recordCount
   */
  recordCount: PropTypes.number,
  /**
   * Handle page change callback
   *
   * ```js
   * function ({ page: number, pageSize: number }) => void
   * ```
   */
  onPageChange: PropTypes.func,
  /**
   * Disables all the pagination inputs
   *
   * @param {boolean} disablePaginationInput
   * @default false
   */
  disablePaginationInput: PropTypes.bool,
  /**
   * Rows per page options available to select from
   *
   * @param {int[]} rowsPerPageOptions
   * @default [5, 10, 20, 25]
   */
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  /**
   * Make the columns sortable
   *
   * Use prop `disableSortby` on `<Column />` to disable sorting for that particular column
   *
   * @param {boolean} sortable
   * @default false
   *
   */
  sortable: PropTypes.bool,
  /**
   * Handle on column sort callback
   *
   * ```js
   * function ({ sortBy: string, direction: 'asc' | 'desc', page: number, pageSize: number }) => void
   * ```
   */
  onSort: PropTypes.func,
};

DataGrid.defaultProps = {
  page: 0,
  pageSize: 10,
  onPageChange: () => {},
  disablePaginationInput: false,
  rowsPerPageOptions: [5, 10, 20, 25],
  sortable: false,
  onSort: () => {},
};

export default DataGrid;
