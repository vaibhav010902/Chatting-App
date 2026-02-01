import { createSlice } from "@reduxjs/toolkit";

const initialState  = {
    userProfile: {},
    status: false
}

const userProfileSlice = createSlice({
    name: "userprofile",
    initialState,
    reducers: {
        addProfile: (state,action) => {
            state.userProfile = action.payload
            if(state.userProfile) state.status = true
        },
        removeProfile: (state,action) => {
            state.userProfile = {}
            state.status = false
        },
        updateProfile: (state,action) => {
            state.userProfile = action.payload
            state.status = true
        }
    }
})

export const {addProfile, removeProfile, updateProfile} = userProfileSlice.actions;
export default userProfileSlice.reducer