import { createAsyncThunk } from "@reduxjs/toolkit";
import { NodeNotParsed } from "../../editedTreeSlice.ts";

export const createNewNode = createAsyncThunk(
    "trees/createNodeMemberData",
    async ({ node, token }: { node: NodeNotParsed; token: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/node/addnode`, {
            method: "POST",
            body: JSON.stringify(node),
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
