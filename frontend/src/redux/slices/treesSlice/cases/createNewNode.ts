import { createAsyncThunk } from "@reduxjs/toolkit";
import { Node } from "../editedTreeSlice.ts";

export const createNewNode = createAsyncThunk(
    "trees/createNodeMemberData",
    async (node: Node) =>
        new Promise<Node>((res, rej) => {
            console.log("thunk running");
            setTimeout(() => {
                if (true) {
                    res(node);
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
