import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { LabelContext } from "../index";

function ProfileLabel() {
  const [state] = useContext(LabelContext);

  return (
    <Box
      sx={{
        marginBottom: "40px",
      }}
    >
      <Typography
        color={"rgb(52, 71, 103)"}
        sx={{
          fontWeight: 500,
          fontSize: "20px",
          textTransform: "capitalize",
        }}
      >
        {state.label}
      </Typography>
      <Typography
        sx={{
          fontSize: "13px",
          color: "#919aa3",
          marginTop: "10px",
          textTransform: "none",
        }}
      >
        {state.sublabel}
      </Typography>
    </Box>
  );
}

export default ProfileLabel;
