import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node, NodeConnection } from "../../editedTreeSlice.ts";

export const createConnection = createAsyncThunk(
    "trees/createConnection",
    async (nodes: [Node & { selected: boolean }, Node & { selected: boolean }]) =>
        new Promise<NodeConnection>((res, rej) => {
            const newId = Math.floor(Math.random() * 500000);
            const [node1, node2] = nodes;
            setTimeout(() => {
                if (true) {
                    res({
                        id: newId,
                        famTreeNumber: 1,
                        from: node1.id,
                        to: node2.id,
                    });
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
