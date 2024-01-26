import { createAsyncThunk } from "@reduxjs/toolkit";
import { Tree } from "../../treeSlice";

export const createNewTree = createAsyncThunk(
    "trees/createNewTree",
    async (tree: Omit<Tree, "id">) =>
        new Promise<Tree>((res, rej) => {
            console.log("thunk running");
            setTimeout(() => {
                if (true) {
                    res({ ...tree, id: "dasd" });
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
