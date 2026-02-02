import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "Friends",
}

const activePanelSlice = createSlice({
    name: "activePanel",
    initialState,
    reducers: {
        setActivePanel: (state, action) => {
            state.name = action.payload;
        }
    }
})

export const {setActivePanel} = activePanelSlice.actions;

export default activePanelSlice.reducer;