import React from "react";
import Icon from "@mui/material/Icon";
function AdditionalFieldIcon({ name, fontSize }) {
  return (
    <Icon fontSize={fontSize} sx={{ color: "#919aa3" }}>
      {name}
    </Icon>
  );
}

export default AdditionalFieldIcon;
