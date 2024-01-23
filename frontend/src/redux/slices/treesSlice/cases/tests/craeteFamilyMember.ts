import { createAsyncThunk } from "@reduxjs/toolkit";
import { FamilyMember } from "../../editedTreeSlice.ts";

export const createFamilyMember = createAsyncThunk(
    "trees/createFamilyMemberData",
    async (member: FamilyMember) =>
        new Promise<FamilyMember>((res, rej) => {
            console.log("thunk running");
            setTimeout(() => {
                if (true) {
                    res(member);
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
