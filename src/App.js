import { Box, Link } from '@material-ui/core';
import { useEffect, useState } from 'react';
import DataGrid, { Column } from './data-grid';
import { getData } from './requests';

function App() {
    const [gridData, setGridData] = useState([]);
    // const [page, setPage] = useState(0);
    const initialPageSize = 10;

    useEffect(() => {
        let mounted = true;

        (async () => {
            const { data } = await getData(`_page=${1}&_limit=${initialPageSize}`);
            if (mounted) {
                setGridData(data);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const handlePageChange = ({ page, pageSize }) => {
        (async () => {
            const { data } = await getData(`_page=${page + 1}&_limit=${pageSize}`);
            setGridData(data);
        })();
    };

    const handleOnSort = ({
        sortBy, direction, page, pageSize,
    }) => {
        (async () => {
            const { data } = await getData(
                `_sort=${sortBy}&_order=${direction}&_page=${
                    page + 1
                }&_limit=${pageSize}`,
            );
            setGridData(data);
        })();
    };

    return (
        <Box padding={4} bgcolor="#efefef" height="100vh">
            <DataGrid
                dense
                data={gridData}
                recordCount={20}
                pageSize={initialPageSize}
                onPageChange={handlePageChange}
                sortable
                onSort={handleOnSort}
            >
                <Column accessor="bill_number" headerId="bill.number" align="right" />
                <Column accessor="bill_amount" header="Amount ₹" />
                <Column accessor="bill_date" headerId="date" align="center" />
                <Column
                    accessor="customer.website"
                    headerId="website"
                    cell={({ value }) => <Link href="#!">{value}</Link>}
                />
                <Column
                    accessor="customer.avatar"
                    header={() => <span>📸</span>}
                    titleId="avatar"
                    align="center"
                    disableSortBy
                    cell={({
                        value, row, cell,
                    }) => (
                        <Box
                            overflow="hidden"
                            display="flex"
                            justifyContent={cell.column.align}
                        >
                            <img
                                width={32}
                                height={32}
                                src={value}
                                alt={row.original.customer.name}
                            />
                        </Box>
                    )}
                />
                <Column
                    accessor="bill_status"
                    headerId="status"
                    disableSortBy
                    align="right"
                />
            </DataGrid>
        </Box>
    );
}

export default App;
