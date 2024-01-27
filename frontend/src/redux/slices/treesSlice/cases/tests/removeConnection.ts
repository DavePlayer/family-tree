import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node } from "../../editedTreeSlice.ts";

export const removeConnection = createAsyncThunk(
    "trees/removeConnection",
    async (node: [Node & { selected: boolean }, Node & { selected: boolean }]) =>
        new Promise<[Node & { selected: boolean }, Node & { selected: boolean }]>((res, rej) => {
            setTimeout(() => {
                if (true) {
                    res(node);
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
