import { Box } from "@material-ui/core";
import { useEffect, useState } from "react";
import DataGrid, { Column } from "./data-grid";
import { getData } from "./requests";

function App() {
  const [data, setData] = useState([]);
  // const [page, setPage] = useState(0);
  const initialPageSize = 10;

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await getData(`_page=${1}&_limit=${initialPageSize}`);
      if (mounted) {
        setData(data);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handlePageChange = ({ page, pageSize }) => {
    (async () => {
      const { data } = await getData(`_page=${page + 1}&_limit=${pageSize}`);
      setData(data);
    })();
  };

  const handleOnSort = ({ sortBy, direction, page, pageSize }) => {
    (async () => {
      const { data } = await getData(
        `_sort=${sortBy}&_order=${direction}&_page=${
          page + 1
        }&_limit=${pageSize}`
      );
      setData(data);
    })();
  };

  return (
    <Box padding={4} bgcolor="#efefef" height="100vh">
      <DataGrid
        dense
        data={data}
        recordCount={20}
        pageSize={initialPageSize}
        onPageChange={handlePageChange}
        sortable
        onSort={handleOnSort}
      >
        <Column accessor="bill_number" Header="bill.number" />
        <Column accessor="bill_amount" Header="amount" />
        <Column accessor="bill_date" Header="date" />
        <Column accessor="bill_status" Header="status" disableSortBy />
      </DataGrid>
    </Box>
  );
}

export default App;
