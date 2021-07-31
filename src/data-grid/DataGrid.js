import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
    useTable,
    usePagination,
    useSortBy,
    useResizeColumns,
    useBlockLayout,
    useRowSelect,
} from 'react-table';
import {
    makeStyles, Paper, Table, TableContainer,
} from '@material-ui/core';
import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import Pagination from './Pagination';
import { DataGridProvider } from './DataGridContext';
import { getColumnHeader, useControlledProps } from './helpers';
import TableHead from './TableHead';
import TableBody from './TableBody';
import CellSelection from './CellSelection';
import { ColumnProps } from './Column';

/**
 * DataGrid component
 */
const DataGrid = (props) => {
    const { paperWrapper, tableStyle, tableFooterStyle } = useStyles();
    const {
        data,
        children,
        page,
        pageSize,
        recordCount,
        sortable,
        dense,
        columns: columnsProp,
        singleSelect,
        onRowSelect,
        selected,
        getRowId: getRowIdProp,
        selectColumnLabel,
    } =
    props;
    const { formatMessage } = useIntl();

    const defaultColumnProps = {
        minWidth: 100,
    };

    const columns = useMemo(
        () => (!isEmpty(columnsProp)
            ? columnsProp
            : React.Children.map(children, (child, index) => {
                const optionalProperties = {};
                if (child.props.cell) {
                    optionalProperties.Cell = child.props.cell;
                }

                return ({
                    columnIndex: index,
                    ...child.props,
                    Header: getColumnHeader(child.props, formatMessage),
                    ...optionalProperties,
                });
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const initialSelectedIds = useMemo(() => {
        const ids = {};
        selected.forEach((sel) => {
            ids[sel] = true;
        });
        return ids;
    }, [selected]);

    const getRowId = useCallback((row, relativeIndex, parent) => {
        if (typeof getRowIdProp === 'string') {
            return `${row[getRowIdProp]}`;
        }
        return `${getRowIdProp(row, relativeIndex, parent)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tableInstance = useTable(
        {
            // Table options
            columns,
            defaultColumn: defaultColumnProps,
            data,
            getRowId,
            // Pagination options
            initialState: {
                pageIndex: page,
                pageSize,
                selectedRowIds: initialSelectedIds,
            },
            manualPagination: true,
            pageCount: -1,
            // Sorting options
            manualSortBy: true,
            disableSortBy: !sortable,
            disableMultiSort: true,
            disableSortRemove: true,
        },
        useResizeColumns,
        useBlockLayout,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((cols) => [
                // Let's make a column for selection
                {
                    defaultCanSort: false,
                    width: 56,
                    minWidth: 0,
                    disableSortBy: true,
                    disableResizing: true,
                    id: 'selection',
                    align: 'center',
                    // The header can use the table's getToggleAllRowsSelectedProps method
                    // to render a checkbox
                    // <CellSelection {...selAllProps} />
                    // eslint-disable-next-line react/prop-types
                    Header: singleSelect ? selectColumnLabel : () => (
                        <span>a</span>
                    ),
                    // The cell can use the individual row's getToggleRowSelectedProps method
                    // to the render a checkbox
                    // eslint-disable-next-line react/prop-types
                    Cell: (selCellProps) => (
                        <CellSelection
                            {...selCellProps}
                            singleSelect={singleSelect}
                            onRowSelect={onRowSelect}
                        />
                    ),
                },
                ...cols,
            ]);
        },
    );

    /**
   * Make DataGrid controlled component
   * Update the DataGrid page/pageSize, when props changed
   */
    useControlledProps({ page, pageSize, tableInstance });

    const {
        getTableProps,
        state: { pageSize: statePageSize },
    } = tableInstance;

    const pageCount = useMemo(
        () => Math.ceil(recordCount / statePageSize),
        [statePageSize, recordCount],
    );

    return (
        <DataGridProvider
            value={{ ...tableInstance, pageCount, dataGridProps: props }}
        >
            <TableContainer component={Paper} className={paperWrapper}>
                <Table
                    size={dense ? 'small' : null}
                    {...getTableProps({ className: tableStyle })}
                >
                    <TableHead />
                    <TableBody />
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

const useStyles = makeStyles(() => ({
    paperWrapper: {
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    tableStyle: {
        flex: 1,
    },
    tableFooterStyle: {
        position: 'sticky',
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
     * Optionally we can specify the columns as an array of `Column` objects
     *
     * **This will override the `<Columns />` passed as `children`**
     *
     * @param {ColumnProps[]} columns
     */
    columns: PropTypes.arrayOf(PropTypes.shape(ColumnProps)),
    /**
     * Specify the key for getting the row id
     *
     * `getRowId: String | (row, index, parent?) => string`
     *
     * Either provide the key for the column to use as key or use the function to generate custom key from the row data
     */
    getRowId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
    /**
     * The current page of the `DataGrid` to display
     *
     * @param {int} page
     * @default 0
     */
    page: PropTypes.number,
    /**
     * Make the rows more compact
     *
     * @param {boolean} dense
     */
    dense: PropTypes.bool,
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
    /**
     * Whether the DataGrid only allows selecting single row at a time
     *
     * @param {boolean} singleSelect
     * @default false
     */
    singleSelect: PropTypes.bool,
    /**
     * Handle row selection
     *
     * `selectedIds` contains the selected row Ids. Example: `[ <rowId1>, <rowId2>, ... ]`
     *
     * ```js
     * function ({ selectedIds: string[] }) => void
     * ```
     */
    onRowSelect: PropTypes.func,
    /**
     * Array of row Ids that should be initially selected
     *
     * @param {string[]} selected
     * @default []
     */
    selected: PropTypes.arrayOf(PropTypes.string),
    /**
     * The Header label to display for selection column
     *
     * This is used when select all rows is disabled or `singleSelect` is `true`
     *
     * @param {string} selectColumnLabel
     * @default ''
     */
    selectColumnLabel: PropTypes.string,
};

DataGrid.defaultProps = {
    page: 0,
    pageSize: 10,
    onPageChange: () => {},
    disablePaginationInput: false,
    rowsPerPageOptions: [5, 10, 20, 25],
    sortable: false,
    onSort: () => {},
    singleSelect: false,
    selected: [],
    selectColumnLabel: '',
};

export default DataGrid;
