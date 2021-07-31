import {
    IconButton,
    makeStyles,
    TextField,
    Typography,
} from '@material-ui/core';
import {
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
} from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDataGridContext } from './DataGridContext';

const PaginationActions = () => {
    const {
        paginationWrapper,
        pageSizeInputWrapper,
        pageSizeSelect,
        pageSizeSelectInput,
    } = useStyles();

    const {
        dataGridProps: { onPageChange, disablePaginationInput },
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex, pageSize },
    } = useDataGridContext();

    const handlePageChange = (page) => {
        onPageChange({ page, pageSize });
    };

    const handleFirstPageButtonClick = () => {
        gotoPage(0);
        handlePageChange(0);
    };

    const handleBackButtonClick = () => {
        previousPage();
        handlePageChange(pageIndex - 1);
    };

    const handleNextButtonClick = () => {
        nextPage();
        handlePageChange(pageIndex + 1);
    };

    const handleLastPageButtonClick = () => {
        gotoPage(pageCount - 1);
        handlePageChange(pageCount - 1);
    };

    const handlePageSelect = (newPage) => {
        gotoPage(newPage);
        handlePageChange(newPage);
    };

    const pageOptions = useMemo(
        () => new Array(pageCount).fill(0).map((_, index) => index),
        [pageCount],
    );

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < pageCount - 1;

    return (
        <div className={paginationWrapper}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={!canPreviousPage || disablePaginationInput}
                aria-label="first page"
            >
                <FirstPage />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={!canPreviousPage || disablePaginationInput}
                aria-label="previous page"
            >
                <KeyboardArrowLeft />
            </IconButton>
            <div className={pageSizeInputWrapper}>
                <Typography variant="body2" id="dropdown-label">
                    <FormattedMessage id="page" />
                </Typography>
                <Autocomplete
                    className={pageSizeSelect}
                    options={pageOptions}
                    value={pageIndex}
                    getOptionLabel={(opt) => `${opt + 1}`}
                    disableClearable
                    renderInput={(params) => (
                        <TextField
                            size="small"
                            inputProps={{
                                className: pageSizeSelectInput,
                            }}
                            {...params}
                        />
                    )}
                    onChange={(_, v) => handlePageSelect(v)}
                />
            </div>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={!canNextPage || disablePaginationInput}
                aria-label="next page"
            >
                <KeyboardArrowRight />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={!canNextPage || disablePaginationInput}
                aria-label="last page"
            >
                <LastPage />
            </IconButton>
        </div>
    );
};

const useStyles = makeStyles((theme) => ({
    paginationWrapper: {
        display: 'flex',
        flexShrink: 0,
    },
    pageSizeInputWrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    pageSizeSelect: {
        padding: theme.spacing(0, 1),
        margin: 0,
    },
    pageSizeSelectInput: {
        width: '3ch',
    },
}));

export default PaginationActions;
