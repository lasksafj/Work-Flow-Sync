import { User } from "@/models/User";
import { createSlice } from "@reduxjs/toolkit";

const initUser: User = {
    lastName: undefined,
    firstName: undefined,
    email: undefined,
    phoneNumber: undefined,
    dateOfBirth: undefined
}

const initialState = {
    profile: initUser,
    accessToken: '',
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.profile = {
                email: action.payload.profile.email,
                lastName: action.payload.profile.last_name,
                firstName: action.payload.profile.first_name,
                phoneNumber: action.payload.profile.phone_number,
                dateOfBirth: action.payload.profile.date_of_birth
            };
            state.accessToken = action.payload.accessToken;
        },
        userLogout: (state) => {
            state.profile = initUser;
            state.accessToken = '';
        },
    },
});


export const { userLogin, userLogout } = userSlice.actions

export default userSlice.reducer