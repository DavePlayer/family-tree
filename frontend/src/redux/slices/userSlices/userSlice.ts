import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./cases/login.ts";
import { Id, toast } from "react-toastify";
import { validateJwt } from "./cases/verifyToken.ts";

export interface TokenData {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
}
export interface User {
    id: string;
    name: string;
}

const initialState: {
    jwt: string;
    userData: User | null;
    toastId?: Id;
} = {
    jwt: "",
    userData: null,
};

const userSlice = createSlice({
    name: "familyTrees",
    initialState,
    reducers: {
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
    },
    extraReducers: (builder) => {
        // ---------------------
        // login User
        // ---------------------
        builder.addCase(loginUser.pending, (state, action) => {
            // toast.dismiss(state.toastId);
            state.toastId = toast.loading("loging in", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `login${action.meta.requestId}`,
            });
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`login${action.meta.requestId}`, {
                    render: "loged in successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });

            localStorage.setItem("JWTtoken", action.payload.jwt);

            return {
                ...state,
                jwt: action.payload.jwt,
                userData: {
                    id: action.payload.tokenData[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                    ],
                    name: action.payload.tokenData[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ],
                },
            };
        });
        builder.addCase(loginUser.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(`login${payload.meta.requestId}`, {
                    render: "failed loging in",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // validate JWT
        // ---------------------
        builder.addCase(validateJwt.pending, (state, action) => {
            // toast.dismiss(state.toastId);
            state.toastId = toast.loading("loging in", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `login${action.meta.requestId}`,
            });
        });
        builder.addCase(validateJwt.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`login${action.meta.requestId}`, {
                    render: "loged in successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });

            return {
                ...state,
                jwt: action.payload.jwt,
                userData: {
                    id: action.payload.tokenData[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                    ],
                    name: action.payload.tokenData[
                        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                    ],
                },
            };
        });
        builder.addCase(validateJwt.rejected, (state, payload) => {
            if (state.toastId)
                toast.update(`login${payload.meta.requestId}`, {
                    render: "Token is not valid. login again please",
                    type: "error",
                    isLoading: false,
                    autoClose: 5000,
                });
            // localStorage.removeItem("JWTtoken");
            console.error(`${payload.error.code}: ${payload.error.message}`);
            console.error(localStorage.getItem("JWTtoken"));
        });
    },
});

export default userSlice.reducer;