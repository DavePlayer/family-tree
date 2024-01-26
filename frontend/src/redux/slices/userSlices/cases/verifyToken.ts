import { createAsyncThunk } from "@reduxjs/toolkit";
import { TokenData } from "../userSlice.ts";
import { jwtDecode } from "jwt-decode";

export const validateJwt = createAsyncThunk("trees/validatejwt", async (token: string) =>
    fetch(
        `${import.meta.env.VITE_API_URL}/api/account/validatejwt?jwt=${
            token.length <= 0 ? "noToken" : token
        }`,
        {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Accept: "application/json",
            },
        }
    )
        .then((data) => {
            if (!data.ok) {
                console.error(data);
                throw new Error(data.statusText);
            } else {
                return data;
            }
        })
        .then(() => {
            const tokenData: TokenData = jwtDecode(token);
            return {
                tokenData,
                jwt: token,
            };
        })
);
