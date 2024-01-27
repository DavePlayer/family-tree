import { createAsyncThunk } from "@reduxjs/toolkit";
import { EditedTreeNotExtended } from "../../editedTreeSlice";

export const fetchEditerTreeData = createAsyncThunk(
    "trees/fetchEditedTree",
    async (treeId: string) =>
        new Promise<EditedTreeNotExtended>((res, rej) => {
            console.log("thunk running");
            setTimeout(() => {
                if (true) {
                    res({
                        familyTree: {
                            id: treeId,
                            name: "test tree",
                            imgUrl: "",
                        },
                        nodes: [
                            {
                                id: "1",
                                famMemId: "1",
                                posX: 300,
                                posY: 200,
                            },
                            {
                                id: "2",
                                famMemId: "2",
                                posX: 400,
                                posY: 300,
                            },
                            {
                                id: "3",
                                famMemId: null,
                                posX: 418,
                                posY: 220,
                            },
                            {
                                id: "4",
                                famMemId: "3",
                                posX: 500,
                                posY: 200,
                            },
                            {
                                id: "5",
                                famMemId: null,
                                posX: 515,
                                posY: 300,
                            },
                            {
                                id: "6",
                                famMemId: null,
                                posX: 490,
                                posY: 250,
                            },
                            {
                                id: "7",
                                famMemId: null,
                                posX: 515,
                                posY: 280,
                            },
                        ],
                        connections: [
                            {
                                id: "1",
                                famTreeNumber: "1",
                                from: "2",
                                to: "3",
                            },
                            {
                                id: "2",
                                famTreeNumber: "1",
                                from: "1",
                                to: "3",
                            },
                            {
                                id: "3",
                                famTreeNumber: "1",
                                from: "4",
                                to: "3",
                            },
                            {
                                id: "4",
                                famTreeNumber: "1",
                                from: "4",
                                to: "5",
                            },
                        ],
                        members: [
                            {
                                id: "1",
                                deathDate: null,
                                imgUrl: "https://styles.redditmedia.com/t5_694yxb/styles/communityIcon_dhqkfwpxb4v81.png",
                                name: "Loid",
                                surname: "Forger",
                                status: "alive",
                                birthDate: new Date(Date.now()),
                                userId: "1",
                                additionalData: "",
                            },
                            {
                                id: "2",
                                deathDate: null,
                                imgUrl: "https://styles.redditmedia.com/t5_yo4xr/styles/communityIcon_eb8yllaafbqb1.png",
                                name: "Anya",
                                surname: "Forger",
                                status: "alive",
                                additionalData: "zajeb mnie",
                                birthDate: new Date(Date.now()),
                                userId: "1",
                            },
                            {
                                id: "3",
                                deathDate: null,
                                imgUrl: "https://i.pinimg.com/474x/ea/6f/8e/ea6f8eb29166d0b2f14faa42f6d32605.jpg",
                                name: "Yor",
                                surname: "Forger",
                                status: "alive",
                                birthDate: new Date(Date.now()),
                                userId: "1",
                            },
                        ],
                    });
                }
                rej(new Error("test promise error"));
            }, 1000);
        })
);
