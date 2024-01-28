import { createSlice } from "@reduxjs/toolkit";
import { Id, toast } from "react-toastify";
import { fetchTrees } from "./cases/fetchTrees.ts";
import { createNewTree } from "./cases/tests/createNewTree.ts";
import { uploadImage } from "../../../globalComponents/functions/uploadImageCase.ts";
import { removeTree } from "./cases/removeTree.ts";

// Define a type for the slice state
export interface Tree {
    id: string;
    name: string;
    imgUrl: string;
}

enum status {
    pending,
    loading,
    loaded,
    error,
}
type TreeSlice = {
    status: status;
    familyTrees: Array<Tree>;
    toastId?: Id;
    tempImageAddr: string;
};

// Define the initial state using that type
const initialState: TreeSlice = {
    status: status.pending,
    familyTrees: [],
    tempImageAddr: "",
};

export const treesSlice = createSlice({
    name: "familyTrees",
    initialState,
    reducers: {
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
    },
    extraReducers: (builder) => {
        // ---------------------
        // Fetch Trees
        // ---------------------
        builder.addCase(fetchTrees.pending, (state) => {
            state.toastId = toast.loading("fetching family trees", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "yoMama",
            });
            state.status = status.loading;
        });
        builder.addCase(fetchTrees.fulfilled, (state, action) => {
            state.status = status.loaded;
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "fetched trees successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            state.familyTrees = action.payload;
        });
        builder.addCase(fetchTrees.rejected, (state) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "failed to fetch trees",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
        });

        // ---------------------
        // Create new Tree
        // ---------------------
        builder.addCase(createNewTree.pending, (state) => {
            state.toastId = toast.loading("creating new tree", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "yoMama",
            });
            state.status = status.loading;
        });
        builder.addCase(createNewTree.fulfilled, (state, action) => {
            state.status = status.loaded;
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "created new tree",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            state.familyTrees = [...state.familyTrees, action.payload];
        });
        builder.addCase(createNewTree.rejected, (state) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "failed to craete new tree",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
        });

        // ---------------------
        // Remove new Tree
        // ---------------------
        builder.addCase(removeTree.pending, (state, payload) => {
            state.toastId = toast.loading("deleting tree", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `rmTree${payload.meta.requestId}`,
            });
            state.status = status.loading;
        });
        builder.addCase(removeTree.fulfilled, (state, action) => {
            state.status = status.loaded;
            const newTrees = state.familyTrees.filter((d) => d.id != action.payload);
            if (state.toastId)
                toast.update(`rmTree${action.meta.requestId}`, {
                    render: "removed tree successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            state.familyTrees = newTrees;
        });
        builder.addCase(removeTree.rejected, (state, payload) => {
            if (state.toastId)
                toast.update(`rmTree${payload.meta.requestId}`, {
                    render: "failed to remove tree",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // Upload image to tree
        // ---------------------
        builder.addCase(uploadImage.pending, (state) => {
            state.status = status.loading;
        });
        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state.status = status.loaded;
            state.tempImageAddr = `${import.meta.env.VITE_API_URL}/assets/${action.payload}`;
        });
        builder.addCase(uploadImage.rejected, () => {
            toast.update(`imageUploadCreateTree`, {
                render: "failed to upload image",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
        });
    },
});

// export const { incrementByAmount } = counterSlice.actions;

export default treesSlice.reducer;
