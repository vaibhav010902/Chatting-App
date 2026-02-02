import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import messageStatusReducer from './messageStatusSlice'
import userProfileReducer from './userProfileSlice'
import activePanelReducer from './activePanelSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messageStatus: messageStatusReducer,
        userprofile: userProfileReducer,
        activePanel: activePanelReducer
    }
})

export default store;