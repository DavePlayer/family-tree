import { createAsyncThunk } from "@reduxjs/toolkit";
import { Tree } from "../treeSlice";

export const createNewTree = createAsyncThunk(
    "trees/createNewTree",
    async (tree: Omit<Tree, "id">) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/account/login`, {
            method: "POST",
            body: JSON.stringify(tree),
            headers: {
                "Content-type": "application/json;charset=utf-8",
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
