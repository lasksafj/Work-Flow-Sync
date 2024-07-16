import { createSlice } from "@reduxjs/toolkit";

// const initOrganization = {
//     organization: ''
// }

const initialState = {
    abbreviation: '',
    name: '',
    address: ''
}

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        updateOrganization: (state, action) => {
            state.abbreviation = action.payload.abbreviation;
            state.name = action.payload.name;
            state.address = action.payload.address;
        }
    },
});


export const { updateOrganization } = organizationSlice.actions

export default organizationSlice.reducer