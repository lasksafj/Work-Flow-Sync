// userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    avatar: string;
}

interface UserState {
    profile: UserProfile;
    accessToken: string;
}

const initUser: UserProfile = {
    lastName: "",
    firstName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    avatar: "",
};

const initialState: UserState = {
    profile: initUser,
    accessToken: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLogin: (state, action: PayloadAction<{ profile: UserProfile; access: string }>) => {
            state.profile = action.payload.profile;
            state.accessToken = action.payload.access;
        },
        userLogout: (state) => {
            state.profile = initUser;
            state.accessToken = "";
        },
    },
});

export const { userLogin, userLogout } = userSlice.actions;
export default userSlice.reducer;
