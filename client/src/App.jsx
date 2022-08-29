import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";

import Header from "./components/common/Header";

function App() {
  return (
    <Box>
      <CssBaseline />
      <Header />
      <Box>
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
