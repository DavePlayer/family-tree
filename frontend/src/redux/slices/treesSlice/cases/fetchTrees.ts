import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTrees = createAsyncThunk("trees/gettrees", async (token: string) =>
    fetch(`${import.meta.env.VITE_API_URL}/trees/gettrees`, {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=utf-8",
            Authorization: `Bearer ${token}`,
        },
    }).then((data) => {
        if (!data.ok) {
            console.error(data);
            throw new Error(data.statusText);
        } else {
            return data.json();
        }
    })
);
