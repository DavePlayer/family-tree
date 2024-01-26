import { createSlice } from "@reduxjs/toolkit";
import { Id, toast } from "react-toastify";
import { fetchTrees } from "./cases/fetchTrees.ts";
import { createNewTree } from "./cases/tests/createNewTree.ts";
import { uploadImage } from "../../../globalComponents/functions/uploadImageCase.ts";

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
                    render: "fetched trees",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            state.familyTrees = action.payload;
        });
        builder.addCase(fetchTrees.rejected, (state, payload) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "failed to get trees",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // Create new Tree
        // ---------------------
        builder.addCase(createNewTree.pending, (state) => {
            console.log("pending trees from thunk");
            state.toastId = toast.loading("fetching family trees", {
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
                    render: "createdNewTree",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            return {
                ...state,
                familyTrees: [...state.familyTrees, action.payload],
            };
        });
        builder.addCase(createNewTree.rejected, (state, payload) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "failed to craete new tree",
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
            console.log("pending trees from thunk");
            state.toastId = toast.loading("fetching family trees", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "yoMama",
            });
            state.status = status.loading;
        });
        builder.addCase(uploadImage.fulfilled, (state, action) => {
            state.status = status.loaded;
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "createdNewTree",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            state.tempImageAddr = `${import.meta.env.VITE_API_URL}/assets/${action.payload}.png`;
        });
        builder.addCase(uploadImage.rejected, (state, payload) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "failed to craete new tree",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });
    },
});

// export const { incrementByAmount } = counterSlice.actions;

export default treesSlice.reducer;
