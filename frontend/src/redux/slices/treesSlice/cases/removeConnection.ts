import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node } from "../editedTreeSlice.ts";

export const removeConnection = createAsyncThunk(
    "trees/removeConnection",
    async ({ token, id }: { token: string; id: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/connection/deleteconnection?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json;charset=utf-8",
                Authorization: `Bearer ${token}`,
            },
        }).then((data) => {
            if (!data.ok) {
                console.error(data);
                throw new Error(data.statusText);
            } else {
                return data.text();
            }
        })
);
