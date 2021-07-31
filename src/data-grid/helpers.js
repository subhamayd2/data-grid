import { useEffect } from 'react';

export const useControlledProps = ({ page, pageSize, tableInstance }) => {
    const {
        pageIndex, state, gotoPage, setPageSize,
    } = tableInstance;

    useEffect(() => {
        if (pageIndex !== page) {
            gotoPage(page);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        if (state.pageSize !== pageSize) {
            setPageSize(pageSize);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageSize]);
};

export const getAlignment = (align) => {
    switch (align) {
    case 'right':
        return 'flex-end';
    case 'center':
        return align;
    default:
        return 'flex-start';
    }
};
