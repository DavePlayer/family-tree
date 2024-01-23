import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node } from "../../editedTreeSlice.ts";

export const removeNode = createAsyncThunk(
    "trees/removeNodeMemberData",
    async (node: Node) =>
        new Promise<Node>((res, rej) => {
            setTimeout(() => {
                if (true) {
                    res(node);
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
