import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginRoute } from "./routes/login/LoginRoute.tsx";
import { ToastContainer } from "react-toastify";
import { TreesViewRoute } from "./routes/trees/TreesViewRoute.tsx";
import { Header } from "./globalComponents/Header.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { TreeEdit } from "./routes/trees/TreeEdit.tsx";
import { ToolHeader } from "./globalComponents/ToolHeader.tsx";
import { Protector } from "./globalComponents/Protector.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/login" element={<LoginRoute />} />
                    <Route path="/register" element={<h1>register</h1>} />
                    <Route element={<Protector />}>
                        <Route element={<Header />}>
                            <Route path="/trees" element={<TreesViewRoute />} />
                        </Route>
                        <Route element={<ToolHeader />}>
                            <Route path="/trees/:id" element={<TreeEdit />} />
                        </Route>
                    </Route>
                    <Route path="/*" element={<h1>404</h1>} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </Provider>
    </React.StrictMode>
);
