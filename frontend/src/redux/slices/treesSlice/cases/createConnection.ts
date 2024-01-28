import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node } from "../editedTreeSlice.ts";

export const createConnection = createAsyncThunk(
    "trees/createConnection",
    async ({
        token,
        nodes,
        familyTreeId,
    }: {
        token: string;
        nodes: [Node & { selected: boolean }, Node & { selected: boolean }];
        familyTreeId: string;
    }) =>
        fetch(`${import.meta.env.VITE_API_URL}/connection/addconnection`, {
            method: "POST",
            body: JSON.stringify({
                id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                familyTreeId,
                from: nodes[0].id,
                to: nodes[1].id,
            }),
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
