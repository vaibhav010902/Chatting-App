import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import messageStatusReducer from './messageStatusSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messageStatus: messageStatusReducer,
    }
})

export default store;