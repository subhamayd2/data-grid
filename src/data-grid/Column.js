import PropTypes from 'prop-types';

/**
 * Create a DataGrid column
 */
const Column = () => null;

export const ColumnProps = {
    /**
     * Path of the property to display from the `data` array object
     *
     * accessor: `String | Function(originalRow, rowIndex) => any`
     */
    accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    /**
     * Name of the column
     *
     * Receives the table instance and column model as props
     *
     * `header: String | Function | React.Component => JSX`
     */
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.node,
    ]),
    /**
     * Column name ID used for Intl
     *
     * `headerId: String`
     */
    headerId: PropTypes.string,
    /**
     * The Intl Id for title of the Column Header. Only needed when using custom component for Header
     *
     * `titleId: String`
     */
    titleId: PropTypes.string,
    /**
     * Add custom component to render in the cell
     *
     * Receives the table instance and column model as props
     *
     * `cell: Function | React.Component => JSX`
     *
     * @default
     * ```js
     * ({ value }) => String(value)
     * ```
     */
    cell: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]),
    /**
     * Whether to disable sorting for this column. Applicable when `sortable` is true for `DataGrid`
     */
    disableSortBy: PropTypes.bool,
    /**
     * Whether to disable resizing of this column
     */
    disableResizing: PropTypes.bool,
    /**
     * Width of the column
     */
    width: PropTypes.number,
    /**
     * Min-width of the column. Applicable when resizing
     */
    minWidth: PropTypes.number,
    /**
     * Max-width of the column. Applicable when resizing
     */
    maxWidth: PropTypes.number,
    /**
     * The alignment of the header cell
     *
     * One of: `"left" | "center" | "right"`
     */
    align: PropTypes.oneOf(['left', 'center', 'right']),
};

Column.propTypes = ColumnProps;

export default Column;
