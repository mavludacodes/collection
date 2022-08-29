import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function HandleSnackbar({ snackbarState, handleCloseSnackbar }) {
  console.log("lakak");
  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={1000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={snackbarState.severity} sx={{ width: "100%" }}>
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
}
const areEqual = (prevProps, nextProps) => {
  if (prevProps.snackbarState.open === nextProps.snackbarState.open) {
    return true; // donot re-render
  }
  return false; // will re-render
};

export default React.memo(HandleSnackbar, areEqual);
