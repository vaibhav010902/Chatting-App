import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import messageStatusReducer from './messageStatusSlice'
import userProfileReducer from './userProfileSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messageStatus: messageStatusReducer,
        userprofile: userProfileReducer,
    }
})

export default store;