import React from "react";
import { useDataGridContext } from "./DataGridContext";
import TableCell from "./TableCell";
import TableRow from "./TableRow";

const TableBody = () => {
  const { getTableBodyProps, page, prepareRow } = useDataGridContext();
  return (
    <div {...getTableBodyProps()}>
      {page.map((row) => {
        prepareRow(row);
        return (
          <TableRow {...row.getRowProps()}>
            {row.cells.map((cell) => (
              <TableCell {...cell.getCellProps()}>
                {cell.render("Cell")}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </div>
  );
};

export default TableBody;
