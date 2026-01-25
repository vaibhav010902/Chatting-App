import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    authChecked: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            // state.authChecked = true;
        },
        logout: (state, action) => {
            state.status = false;
            state.userData = null;
            state.authChecked = false;
        },
        setAuthChecked: (state) => {
            // state.authChecked = true;
        },
    }
})

export const {login, logout,setAuthChecked} = authSlice.actions;
export default authSlice.reducer;