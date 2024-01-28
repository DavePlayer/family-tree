import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
    "trees/resigterUser",
    async (user: { email: string; password: string; name: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/account/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json;charset=utf-8",
            },
        }).then((data) => {
            if (!data.ok) {
                console.error(data);
                throw new Error(data.statusText);
            } else {
                return data.text();
            }
        })
);
