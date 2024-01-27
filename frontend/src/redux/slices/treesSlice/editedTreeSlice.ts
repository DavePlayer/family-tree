import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Id, toast } from "react-toastify";
import { Tree } from "./treeSlice.ts";
import { fetchEditerTreeData } from "./cases/fetchEditTreeData.ts";
import { updateFamilyMemberData } from "./cases/updateFamilyMemberData.ts";
import { createFamilyMember } from "./cases/craeteFamilyMember.ts";
import { createNewNode } from "./cases/createNewNode.ts";
import { removeNode } from "./cases/RemoveNode.ts";
import { removeConnection } from "./cases/tests/removeConnection.ts";
import { createConnection } from "./cases/tests/createConnection.ts";
import { uploadImage } from "../../../globalComponents/functions/uploadImageCase.ts";

enum status {
    pending,
    loading,
    loaded,
    error,
}

export interface FamilyMemberToUpdate {
    famMember: FamilyMember;
    image?: File;
}

export interface FamilyMember {
    id: string;
    userId: string;
    imgUrl?: string;
    name: string;
    surname: string;
    status: string;
    birthDate: Date | null;
    deathDate: Date | null;
    additionalData: string;
}

export interface NodeConnection {
    id: string;
    famTreeNumber: string;
    from: string;
    to: string;
}

export interface Node {
    id: string;
    posX: number;
    posY: number;
    familyTree: string;
    famMemId: string | null;
}

export interface NodeNotParsed {
    id: string;
    posX: number;
    posY: number;
    familyTree: string;
    familyMember: string | null;
}

export enum MouseMode {
    None,
    Create,
    Link,
    RmLink,
    Delete,
    CreateNode,
}

export interface EditedTree {
    familyTree: Tree | null;
    status: status;
    members: Array<FamilyMember>;
    nodes: Array<Node & { selected: boolean }>;
    connections: Array<NodeConnection>;
    toastId?: Id;
    MouseMode: MouseMode;
    tempImageAddr?: string;
}

export interface EditedTreeNotExtended {
    familyTree: Tree | null;
    members: Array<FamilyMember>;
    nodes: Array<Node>;
    connections: Array<NodeConnection>;
}

// Define the initial state using that type
const initialState: EditedTree = {
    familyTree: null,
    status: status.pending,
    members: [],
    nodes: [],
    connections: [],
    toastId: "getEfitedTree",
    MouseMode: MouseMode.None,
};

export const treesSlice = createSlice({
    name: "familyTrees",
    initialState,
    reducers: {
        // incrementByAmount: (state, action: PayloadAction<number>) => {
        //     state.value += action.payload;
        // },
        setMouseMode: (state, action: PayloadAction<MouseMode>) => {
            state.MouseMode = action.payload;
        },

        setSelectedNode: (state, action: PayloadAction<Node>) => {
            const newNodes: Array<Node & { selected: boolean }> = state.nodes.map((o) =>
                o.id === action.payload.id ? { ...o, selected: true } : o
            );

            state.nodes = newNodes;
        },
        resetSelection: (state) => {
            const newNodes = state.nodes.map((o) => {
                return {
                    ...o,
                    selected: false,
                };
            });

            state.nodes = newNodes;
        },
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
            // add selected property to every node
            console.log(action.payload);
            const oldNodes = action.payload.nodes;
            const newNodes = oldNodes.map((o: NodeNotParsed) => {
                return {
                    ...o,
                    selected: false,
                    famMemId: o.familyMember,
                };
            });
            const newMembers = action.payload.members.map((member: FamilyMember) => {
                return {
                    ...member,
                    birthDate: member.birthDate ? new Date(member.birthDate) : null,
                    deathDate: member.deathDate ? new Date(member.deathDate) : null,
                };
            });

            // initialize new State with new properties
            const newState: EditedTree = {
                ...state,
                status: status.loaded,
                ...action.payload,
                nodes: newNodes,
                members: newMembers,
            };

            // give info abut fetching tree
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

        // ---------------------
        // Update Family Member
        // ---------------------
        builder.addCase(updateFamilyMemberData.pending, (state) => {
            console.log("pending updating family member from thunk");
            state.toastId = toast.loading("Updating Family member", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "UpdateFamMember",
            });
            state.status = status.loading;
        });
        builder.addCase(updateFamilyMemberData.fulfilled, (state, action) => {
            action.payload.birthDate = action.payload.birthDate
                ? new Date(action.payload.birthDate)
                : null;
            action.payload.deathDate = action.payload.deathDate
                ? new Date(action.payload.deathDate)
                : null;
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "updates member successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            return {
                ...state,
                members: [
                    ...state.members.filter((o) => o.id != action.payload.id),
                    action.payload,
                ],
            };
        });
        builder.addCase(updateFamilyMemberData.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to update member",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // Create Family Member
        // ---------------------
        builder.addCase(createFamilyMember.pending, (state) => {
            state.toastId = toast.loading("creating Family member", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: "UpdateFamMember",
            });
            state.status = status.loading;
        });
        builder.addCase(createFamilyMember.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(state.toastId, {
                    render: "created member successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            action.payload.birthDate = new Date(action.payload.birthDate);
            return { ...state, members: [...state.members, action.payload] };
        });
        builder.addCase(createFamilyMember.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to create member",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // Create new Node
        // ---------------------
        builder.addCase(createNewNode.pending, (state, action) => {
            state.toastId = toast.loading("craeting new node", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `createNode${action.meta.requestId}`,
            });
            state.status = status.loading;
        });
        builder.addCase(createNewNode.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`createNode${action.meta.requestId}`, {
                    render: "created new node successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            const newNode = {
                famMemId: action.payload.familyMember,
                selected: false,
                ...action.payload,
            };
            return { ...state, nodes: [...state.nodes, newNode] };
        });
        builder.addCase(createNewNode.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to create new node",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // remove Node
        // ---------------------
        builder.addCase(removeNode.pending, (state, action) => {
            // toast.dismiss(state.toastId);
            state.toastId = toast.loading("removing node with its links", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `removeNode${action.meta.requestId}`,
            });
            state.status = status.loading;
        });
        builder.addCase(removeNode.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`removeNode${action.meta.requestId}`, {
                    render: "removed nodes successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            const newNodes = state.nodes.filter((o) => o.id != action.payload.id);
            const newConnections = state.connections.filter(
                (o) => o.from != action.payload.id && o.to != action.payload.id
            );
            return { ...state, nodes: newNodes, connections: newConnections };
        });
        builder.addCase(removeNode.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(`removeNode${payload.meta.requestId}`, {
                    render: "failed to remove node",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`, payload.error);
        });

        // ---------------------
        // remove Connection
        // ---------------------
        builder.addCase(removeConnection.pending, (state, action) => {
            // toast.dismiss(state.toastId);
            state.toastId = toast.loading("deleting connection", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `removeConnection${action.meta.requestId}`,
            });
            state.status = status.loading;
        });
        builder.addCase(removeConnection.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`removeConnection${action.meta.requestId}`, {
                    render: "removed connection successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            const [node1, node2] = action.payload;
            const newConnections = state.connections.filter(
                (o) =>
                    !(
                        (o.from === node1.id && o.to === node2.id) ||
                        (o.from === node2.id && o.to === node1.id)
                    )
            );
            const newNodes = state.nodes.map((o) => {
                return {
                    ...o,
                    selected: false,
                    MouseMode: MouseMode.None,
                };
            });
            return { ...state, connections: newConnections, nodes: newNodes };
        });
        builder.addCase(removeConnection.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to remove connection",
                    type: "error",
                    isLoading: false,
                    autoClose: 2000,
                });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });

        // ---------------------
        // create Connection
        // ---------------------
        builder.addCase(createConnection.pending, (state, action) => {
            // toast.dismiss(state.toastId);
            state.toastId = toast.loading("creating new connection", {
                autoClose: 5000,
                closeButton: true,
                closeOnClick: true,
                toastId: `removeConnection${action.meta.requestId}`,
            });
            state.status = status.loading;
        });
        builder.addCase(createConnection.fulfilled, (state, action) => {
            if (state.toastId)
                toast.update(`removeConnection${action.meta.requestId}`, {
                    render: "created connection successfully",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                });
            const newNodes = state.nodes.map((o) => {
                return {
                    ...o,
                    selected: false,
                };
            });
            return {
                ...state,
                connections: [...state.connections, action.payload],
                nodes: newNodes,
                MouseMode: MouseMode.None,
            };
        });
        builder.addCase(createConnection.rejected, (state, payload) => {
            if (state && state.toastId)
                toast.update(state.toastId, {
                    render: "failed to create connection",
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
        builder.addCase(uploadImage.rejected, (state, payload) => {
            toast.update(`imageUpload`, {
                render: "failed to upload image",
                type: "error",
                isLoading: false,
                autoClose: 2000,
            });
            console.error(`${payload.error.code}: ${payload.error.message}`);
        });
    },
});

export const { setMouseMode, setSelectedNode, resetSelection } = treesSlice.actions;

export default treesSlice.reducer;
