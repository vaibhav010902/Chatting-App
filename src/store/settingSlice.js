import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatTheme: "light",
    chatWallpaper: null,
    fontSize: "",
}

const settingSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action) => {
            state.chatTheme= action.payload.theme,
            state.chatWallpaper = action.payload.wallpaper,
            state.fontSize= action.payload.fontsize
        },
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

export const {setSettings, setChatTheme, setChatWallpaper, setFontSize} = settingSlice.actions;
export default settingSlice.reducer;