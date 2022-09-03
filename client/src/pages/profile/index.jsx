import React, { useEffect, useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import CssBaseline from "@mui/material/CssBaseline";

import ProfileSidebar from "./components/ProfileSidebar";
import ProfileLabel from "./components/ProfileLabel";

const LabelContext = React.createContext([{}, () => {}]);

function Profile() {
  const current_user = JSON.parse(localStorage.getItem("current_user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!current_user) {
      navigate("/auth/login");
    }
  }, []);

  const [state, setState] = useState({ label: "sss", sublabel: "sssdd" });

  return (
    <LabelContext.Provider value={[state, setState]}>
      <Box sx={{ display: "flex", background: "#F6F9FC" }}>
        <CssBaseline />
        <ProfileSidebar change="nochange" />
        <Box
          sx={{
            mt: { xs: "50px", sm: "70px" },
            flexGrow: 1,
            p: 4,
            width: { sm: `calc(100% - ${240}px)` },
            minHeight: "100vh",
          }}
        >
          <ProfileLabel />
          <Outlet />
        </Box>
      </Box>
    </LabelContext.Provider>
  );
}

export { Profile, LabelContext };
