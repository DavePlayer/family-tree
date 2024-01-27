import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateFamilyMemberData = createAsyncThunk(
    "trees/updateFamilyMemberData",
    async ({
        member,
        token,
    }: {
        member: {
            id: string;
            imgUrl: string | null;
            name: string;
            surname: string;
            birthDate: Date | null;
            deathDate: Date | null;
            status: string;
            additionalData: string;
        };
        token: string;
    }) =>
        fetch(`${import.meta.env.VITE_API_URL}/member/editfamilymember`, {
            method: "POST",
            body: JSON.stringify({
                ...member,
                birthDate: member.birthDate ? member.birthDate?.toLocaleDateString("en-CA") : null,
                deathDate: member.deathDate ? member.deathDate?.toLocaleDateString("en-CA") : null,
                imgUrl: member.imgUrl ? member.imgUrl : null,
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
