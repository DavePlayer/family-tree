import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import treesSlice from "./slices/treesSlice/treeSlice.ts";
import editedTreeSlice from "./slices/treesSlice/editedTreeSlice.ts";
import { useDispatch } from "react-redux";
import userSlice from "./slices/userSlices/userSlice.ts";

export const store = configureStore({
    reducer: { trees: treesSlice, editedTree: editedTreeSlice, user: userSlice },
    // middleware used to display state static/async state changes
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
