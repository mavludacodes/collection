import React from "react";
import { Outlet } from "react-router-dom";

function index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default index;
