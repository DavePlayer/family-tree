import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginRoute } from "./routes/login/LoginRoute.tsx";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/login" element={<LoginRoute />} />
                <Route path="/register" element={<h1>register</h1>} />
                <Route path="/*" element={<h1>404</h1>} />
            </Routes>
        </BrowserRouter>
        <ToastContainer />
    </React.StrictMode>
);
