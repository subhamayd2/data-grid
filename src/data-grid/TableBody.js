import React from 'react';
import {
    TableBody as CoreTableBody,
    TableRow,
    TableCell,
    Typography,
    makeStyles,
} from '@material-ui/core';
import { useDataGridContext } from './DataGridContext';

const TableBody = () => {
    const { tableCellStyle, tableCellContentStyle } = useStyles();
    const { getTableBodyProps, page, prepareRow } = useDataGridContext();

    return (
        <CoreTableBody {...getTableBodyProps()}>
            {page.map((row) => {
                prepareRow(row);

                return (
                    <TableRow {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                            const { column } = cell;
                            console.log({ cell });
                            return (
                                <TableCell
                                    {...cell.getCellProps({
                                        className: tableCellStyle,
                                    })}
                                    title={cell.value}
                                    align={column.align}
                                >
                                    <div className={tableCellContentStyle}>
                                        <Typography variant="inherit" noWrap>
                                            {cell.render('Cell')}
                                        </Typography>
                                    </div>
                                </TableCell>
                            );
                        })}
                    </TableRow>
                );
            })}
        </CoreTableBody>
    );
};

const useStyles = makeStyles((theme) => ({
    tableCellStyle: {
        padding: theme.spacing(0.75, 1),
        textOverflow: 'ellipsis',
        overflowX: 'hidden',
    },
    tableCellContentStyle: {
        height: '100%',
        display: 'grid',
        alignItems: 'center',
    },
}));

export default TableBody;
