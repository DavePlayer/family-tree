import { createAsyncThunk } from "@reduxjs/toolkit";
import { NodeNotParsed } from "../editedTreeSlice.ts";

export const removeNode = createAsyncThunk(
    "trees/removeNodeMemberData",
    async ({ node, token }: { node: NodeNotParsed; token: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/node/deletenode?id=${node.id}`, {
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
                return node;
            }
        })
);
