import React, { forwardRef, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, makeStyles, Radio } from '@material-ui/core';

const CellSelection = forwardRef(
    (props, ref) => {
        const {
            row: {
                isSelected,
                id,
                getToggleRowSelectedProps,
                toggleRowSelected,
            },
            state: { selectedRowIds },
            toggleAllRowsSelected,
            singleSelect,
            onRowSelect,
        } = props;
        const { inputStyle } = useStyles();
        const defaultRef = useRef();
        const resolvedRef = ref || defaultRef;

        const { indeterminate, ...rest } = getToggleRowSelectedProps({
            onChange: () => {
                if (singleSelect) {
                    toggleAllRowsSelected(false);
                    onRowSelect({ selectedIds: [`${id}`] });
                } else {
                    let selectedIds = [...Object.keys(selectedRowIds)];
                    if (isSelected) {
                        selectedIds = selectedIds.filter((x) => x !== `${id}`);
                    } else {
                        selectedIds.push(`${id}`);
                    }
                    onRowSelect({ selectedIds });
                }
                toggleRowSelected();
            },
        });

        useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);

        const Component = singleSelect ? Radio : Checkbox;

        return (
            <Component
                color="primary"
                size="small"
                ref={resolvedRef}
                classes={{
                    root: inputStyle,
                }}
                {...rest}
            />
        );
    },
);

const useStyles = makeStyles((theme) => ({
    inputStyle: {
        padding: theme.spacing(0.25),
    },
}));

CellSelection.propTypes = {
    indeterminate: PropTypes.bool,
    row: PropTypes.object,
    singleSelect: PropTypes.bool,
    onRowSelect: PropTypes.func,
    toggleAllRowsSelected: PropTypes.func,
    state: PropTypes.object,
};

export default CellSelection;
