import { createAsyncThunk } from "@reduxjs/toolkit";
import { TokenData } from "../userSlice.ts";
import { jwtDecode } from "jwt-decode";

export const loginUser = createAsyncThunk(
    "trees/loginUser",
    async (user: { email: string; password: string }) =>
        fetch(`${import.meta.env.VITE_API_URL}/api/account/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-type": "application/json;charset=utf-8",
            },
        })
            .then((data) => {
                if (!data.ok) {
                    console.error(data);
                    throw new Error(data.statusText);
                } else {
                    return data.text();
                }
            })
            .then((token) => {
                const tokenData: TokenData = jwtDecode(token);
                return {
                    tokenData,
                    jwt: token,
                };
            })
);
