import React from "react";

import { Typography } from "@mui/material";

function AdditionalFieldTypography({ title, variant, marginLeft }) {
  return (
    <Typography color="#919aa3" variant={variant} ml={marginLeft ? 0 : 1}>
      {title}
    </Typography>
  );
}

export default AdditionalFieldTypography;
