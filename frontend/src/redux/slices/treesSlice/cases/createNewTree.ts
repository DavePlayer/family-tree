import { createAsyncThunk } from "@reduxjs/toolkit";
import { Tree } from "../treeSlice";

export const createNewTree = createAsyncThunk(
    "trees/createNewTree",
    async ({ tree, token }: { tree: Omit<Tree, "id">; token: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/trees/addtree`, {
            method: "POST",
            body: JSON.stringify(tree),
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
