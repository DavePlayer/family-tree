import { createSlice } from "@reduxjs/toolkit";
import { Id, toast } from "react-toastify";
import { Tree } from "./treeSlice.ts";
import { fetchEditerTreeData } from "./cases/tests/fetchEditTreeData.ts";

enum status {
    pending,
    loading,
    loaded,
    error,
}

export interface FamilyMember {
    img_url: string;
    id: number;
    name: string;
    status: string;
    deathTime: Date | null;
    address: string;
    additionalData?: string;
}

export interface NodeConnection {
    id: number;
    famTreeNumber: number;
    from: number;
    to: number;
}

export interface Node {
    id: number;
    posX: number;
    posY: number;
    famMemId: number | null;
}

export interface EditedTree {
    tree: Tree | null;
    status: status;
    members: Array<FamilyMember>;
    nodes: Array<Node>;
    connections: Array<NodeConnection>;
    toastId?: Id;
}

// Define the initial state using that type
const initialState: EditedTree = {
    tree: null,
    status: status.pending,
    members: [],
    nodes: [],
    connections: [],
    toastId: "getEfitedTree",
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
        // Fetch edited Tree
        // ---------------------
        builder.addCase(fetchEditerTreeData.pending, (state) => {
            console.log("pending trees from thunk");
            state.toastId = toast.loading("fetching Tree Data to Edit", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "getEfitedTree",
            });
            state.status = status.loading;
        });
        builder.addCase(fetchEditerTreeData.fulfilled, (state, action) => {
            const newState = {
                ...state,
                status: status.loaded,
                ...action.payload,
            };
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "fetched tree",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            return newState;
        });
        builder.addCase(fetchEditerTreeData.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to get given tree",
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
