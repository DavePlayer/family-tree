import { createAsyncThunk } from "@reduxjs/toolkit";
import { Tree } from "../treeSlice";

export const removeTree = createAsyncThunk(
    "trees/removeTree",
    async ({ id, token }: { id: string; token: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/trees/deletetree?id=${id}`, {
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
                return id;
            }
        })
);
