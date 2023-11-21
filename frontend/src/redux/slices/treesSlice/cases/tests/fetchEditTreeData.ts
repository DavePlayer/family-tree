
import { createAsyncThunk } from "@reduxjs/toolkit";
import { EditedTree } from "../../editedTreeSlice";
import { Tree } from "../../treeSlice";

export const fetchEditerTreeData = createAsyncThunk(
    "trees/fetchEditedTree",
    async (tree: Tree) =>
        new Promise<Omit<EditedTree, "status">>((res, rej) => {
            console.log("thunk running");
            setTimeout(() => {
                if (true) {
                    res({
                        tree: tree,
                        nodes: [
                            {
                                id: 1,
                                famMemId: 1,
                                posX: 1,
                                posY: 1
                            },
                            {
                                id: 2,
                                famMemId: 2,
                                posX: 3,
                                posY: 1
                            },
                            {
                                id: 1,
                                famMemId: null,
                                posX: 2,
                                posY: 2
                            }
                        ],
                        members: [
                            {
                                id: 1,
                                address: "fajna ulica",
                                deathTime: null,
                                img_url: "asd",
                                name: "family member 1",
                                status: "alive"
                            },
                            {
                                id: 2,
                                address: "fajna ulica",
                                deathTime: null,
                                img_url: "asd",
                                name: "family member 2",
                                status: "alive"
                            }
                        ]
                    });
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);