import React from "react";
import MuiAlert from "@mui/material/Alert";

const Banner = ({ message, severity = "success", onClose }) => {
  if (!message) return null;

  return (
    <MuiAlert
      severity={severity}
      variant="filled"
      onClose={onClose}
      sx={{ width: "100%", maxWidth: 480, mb: 2 }}
    >
      {message}
    </MuiAlert>
  );
};

export default Banner;
