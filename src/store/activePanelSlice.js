import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "Friends",
    previous: ""
}

const activePanelSlice = createSlice({
    name: "activePanel",
    initialState,
    reducers: {
        setActivePanel: (state, action) => {
            state.previous = state.name;
            state.name = action.payload;
        }
    }
})

export const {setActivePanel} = activePanelSlice.actions;

export default activePanelSlice.reducer;