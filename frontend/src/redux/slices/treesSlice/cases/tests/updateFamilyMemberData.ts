import { createAsyncThunk } from "@reduxjs/toolkit";
import { FamilyMember, FamilyMemberToUpdate } from "../../editedTreeSlice.ts";

export const updateFamilyMemberData = createAsyncThunk(
    "trees/updateFamilyMemberData",
    async (data: FamilyMemberToUpdate) =>
        new Promise<FamilyMember>((res, rej) => {
            console.log("thunk running");
            data.famMember = {
                ...data.famMember,
                img_url: data.image ? URL.createObjectURL(data.image) : data.famMember.img_url
            }
            setTimeout(() => {
                if (true) {
                    res(data.famMember);
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
