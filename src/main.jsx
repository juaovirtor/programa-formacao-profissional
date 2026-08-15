import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AdminApp from "./admin/AdminApp";
import "./index.css";

/** Duas telas: o site público em "/" e o painel da equipe em "/admin". */
const ehAdmin = window.location.pathname.replace(/\/+$/, "") === "/admin";

createRoot(document.getElementById("root")).render(
  <StrictMode>{ehAdmin ? <AdminApp /> : <App />}</StrictMode>,
);
