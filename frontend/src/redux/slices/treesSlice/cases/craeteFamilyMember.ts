import { createAsyncThunk } from "@reduxjs/toolkit";

export const createFamilyMember = createAsyncThunk(
    "trees/createFamilyMemberData",
    async ({
        member,
        token,
    }: {
        member: {
            id: string;
            imgUrl: string;
            name: string;
            surname: string;
            birthDate: Date | null;
            deathDate: Date | null;
            status: string;
            additionalData: string;
        };
        token: string;
    }) =>
        fetch(`${import.meta.env.VITE_API_URL}/member/addfamilymember`, {
            method: "POST",
            body: JSON.stringify({
                ...member,
                // birthDate: member.birthDate?.toLocaleDateString("en-CA"),
                // deathDate: member.deathDate?.toLocaleDateString("en-CA"),
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
