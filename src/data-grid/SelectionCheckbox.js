import React from "react";
import PropTypes from "prop-types";
import { Checkbox, makeStyles } from "@material-ui/core";

const SelectionCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const { checkBoxStyle } = useStyles();
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox
        size="small"
        ref={resolvedRef}
        classes={{
          root: checkBoxStyle,
        }}
        {...rest}
      />
    );
  }
);

const useStyles = makeStyles((theme) => ({
  checkBoxStyle: {
    padding: theme.spacing(0.25),
  },
}));

SelectionCheckbox.propTypes = {
  indeterminate: PropTypes.bool,
};

export default SelectionCheckbox;
