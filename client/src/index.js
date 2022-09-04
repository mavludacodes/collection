import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// custom route components
// auth
import Auth from "./auth/index";
import Login from "./auth/Login";
import Register from "./auth/Register";

// profile
import { Profile } from "./pages/profile/index";
import Users from "./pages/profile/adminProfile/Users";
import Collections from "./pages/profile/adminProfile/Collections";
import MyCollections from "./pages/profile/userProfile/MyCollections";
import CreateCollection from "./pages/profile/userProfile/CreateCollection";
import TableItems from "./pages/profile/userProfile/TableItems";

// main page
import Main from "./pages/main";
import ItemPage from "./pages/main/ItemPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Main />} />
          <Route path="/item" element={ItemPage} />
        </Route>
        <Route path="auth" element={<Auth />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="profile" element={<Profile />}>
          <Route path="users" element={<Users />} />
          <Route path="create-collection" element={<CreateCollection />} />
          <Route path="collections" element={<Collections />} />
          <Route path="my-collections" element={<MyCollections />} />
          <Route path="collection-items/:id" element={<TableItems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
