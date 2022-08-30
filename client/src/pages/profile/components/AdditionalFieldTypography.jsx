import React from "react";

import { Typography } from "@mui/material";

function AdditionalFieldTypography({ title, variant, marginLeft }) {
  return (
    <Typography
      width={"200px"}
      color="rgb(52, 71, 103)"
      variant={variant}
      ml={marginLeft ? 0 : 1}
    >
      {title}
    </Typography>
  );
}

export default AdditionalFieldTypography;
