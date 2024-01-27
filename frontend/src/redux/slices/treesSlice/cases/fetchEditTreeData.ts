import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEditerTreeData = createAsyncThunk(
    "trees/fetchEditedTree",
    async ({ treeId, token }: { treeId: string; token: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/trees/getwholetree`, {
            method: "GET",
            headers: {
                "Content-type": "application/json;charset=utf-8",
                Authorization: `Bearer ${token}`,
                id: treeId,
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
