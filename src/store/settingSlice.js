import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatTheme: "light",
    chatWallpaper: "",
    fontSize: "",
}

const settingSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setChatTheme: (state,action) => {
            state.chatTheme = action.payload
        },
        setChatWallpaper: (state,action) => {
            state.chatWallpaper = action.payload
        },
        setFontSize: (state,action) => {
            state.fontSize = action.payload
        }
    }
})

export const {setChatTheme, setChatWallpaper, setFontSize} = settingSlice.actions;
export default settingSlice.reducer;