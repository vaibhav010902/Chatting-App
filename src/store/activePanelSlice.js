import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "Friends",
    previous: "",
    contact_id: null,
}

const activePanelSlice = createSlice({
    name: "activePanel",
    initialState,
    reducers: {
        setActivePanel: (state, action) => {
            state.previous = state.name;
            state.name = action.payload;
        },
        setActivePanelContactId: (state, action) => {
            state.contact_id = action.payload
        }
    }
})

export const {setActivePanel, setActivePanelContactId} = activePanelSlice.actions;

export default activePanelSlice.reducer;