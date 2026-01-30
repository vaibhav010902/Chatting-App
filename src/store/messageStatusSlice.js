import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    unreadByUser: {},
    totalUnread: 0
};  

const messageStatusSlice = createSlice({
    name: "messageStatus",
    initialState,
    reducers: {
        setUnreadByUser: (state, action) => {
            // console.log("Hello from setUnreadByUser in messageStatusSlice.js")
            const senderId = action.payload;
            state.unreadByUser[senderId] = (state.unreadByUser[senderId] || 0)+1;
            state.totalUnread += 1;
        },
        resetUnreadByUser: (state, action) => {
            // console.log("Hello from setUnreadByUser in messageStatusSlice.js")
            const senderId = action.payload;
            state.totalUnread -= state.unreadByUser[senderId] || 0;
            delete state.unreadByUser[senderId];
        }
    }
})

export const { setUnreadByUser, resetUnreadByUser } = messageStatusSlice.actions;
export default messageStatusSlice.reducer;