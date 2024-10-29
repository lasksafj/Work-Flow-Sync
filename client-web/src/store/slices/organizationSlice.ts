// organizationSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OrganizationState {
    abbreviation: string;
    name: string;
    address: string;
}

const initialState: OrganizationState = {
    abbreviation: "",
    name: "",
    address: "",
};

const organizationSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        updateOrganization: (state, action: PayloadAction<OrganizationState>) => {
            state.abbreviation = action.payload.abbreviation;
            state.name = action.payload.name;
            state.address = action.payload.address;
        },
    },
});

export const { updateOrganization } = organizationSlice.actions;
export default organizationSlice.reducer;
