import { createSlice } from "@reduxjs/toolkit";
import { Id, toast } from "react-toastify";
import { fetchTrees } from "./cases/tests/fetchTrees.ts";

// Define a type for the slice state
export interface Tree {
    id: number;
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
};

// Define the initial state using that type
const initialState: TreeSlice = {
    status: status.pending,
    familyTrees: [],
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
            console.log("pending trees from thunk");
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
    },
});

// export const { incrementByAmount } = counterSlice.actions;

export default treesSlice.reducer;
