import React, { memo } from "react";
import PropTypes from "prop-types";

const TableCell = ({ children, sortDirection, ...props }) => {
  return (
    <div aria-sort={sortDirection || null} {...props}>
      {children}
    </div>
  );
};

TableCell.propTypes = {
  children: PropTypes.node,
  sortDirection: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

export default memo(TableCell);
