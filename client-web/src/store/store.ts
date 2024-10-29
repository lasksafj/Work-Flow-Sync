// store.ts

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import organizationReducer from "./slices/organizationSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        organization: organizationReducer,
    },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
