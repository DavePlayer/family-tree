import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import treesSlice from "./slices/treesSlice/treeSlice.ts";

export const store = configureStore({
    reducer: { trees: treesSlice },
    // middleware used to display state static/async state changes
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
