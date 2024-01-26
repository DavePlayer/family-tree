import { createAsyncThunk } from "@reduxjs/toolkit";

export const uploadImage = createAsyncThunk(
    "uploadImage",
    async ({ file, treeId, token }: { file: File; treeId: string; token: string }) => {
        const formData = new FormData();
        formData.append("image", file);
        return fetch(`${import.meta.env.VITE_API_URL}/file/uploadimage?id=${treeId}`, {
            method: "POST",
            headers: {
                "Content-type": "application/json;charset=utf-8",
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
