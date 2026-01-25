import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getMessagesByChat, saveMessages} from "../db/messageStorage";
import { Loading } from "../component";

export const loadLocalMessages = createAsyncThunk(
    "chat/loadLocalMessages",
    async (conversationId) => {
        return await getMessagesByChat(conversationId);
    }
)

const initialState = {
    activeConversationId: null,
    messages: [],
    loading: false,
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setActiveChat: (state, action) => {
            state.activeConversationId = action.payload;
            state.messages = [];
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
            saveMessages([action.payload]);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
            saveMessages(action.payload);
        }
    }
})

export const {setActiveChat, addMessage, setMessages} = chatSlice.actions;
export default chatSlice.reducer;