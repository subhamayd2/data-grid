import PropTypes from "prop-types";

/**
 * Create a DataGrid column
 */
const Column = () => null;

Column.propTypes = {
  /**
   * Path of the property to display from the `data` array object
   *
   * accessor: `String | Function(originalRow, rowIndex) => any`
   */
  accessor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Name of the column
   *
   * `Header: String | Function | React.Component => JSX`
   */
  Header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
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
  align: PropTypes.oneOf(["left", "center", "right"]),
};

export default Column;
