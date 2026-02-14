import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    requestList: []
}

const requestListSlice = createSlice({
    name: "requestlist",
    initialState,
    reducers: {
        setRequestList: (state, action) => {
            state.requestList = action.payload
        },
    }
})

export const {setRequestList} = requestListSlice.actions;
export default requestListSlice.reducer;