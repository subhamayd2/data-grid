import React, { memo } from "react";
import PropTypes from "prop-types";

const TableRow = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

TableRow.propTypes = {
  children: PropTypes.node,
};

export default memo(TableRow);
