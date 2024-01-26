import { createAsyncThunk } from "@reduxjs/toolkit";

export const uploadImage = createAsyncThunk(
    "uploadImage",
    async ({ file, token }: { file: File; token: string }) => {
        const formData = new FormData();
        formData.append("file", file);
        return fetch(`${import.meta.env.VITE_API_URL}/file/uploadimage`, {
            method: "POST",
            headers: {
                // "Content-type": "multipart/form-data; boundary=<calculated when request is sent>",
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        }).then((data) => {
            if (!data.ok) {
                console.error(data);
                throw new Error(data.statusText);
            } else {
                return data.text();
            }
        });
    }
);
