import {configureStore} from '@reduxjs/toolkit'
import authReducer from './authSlice'
import chatReducer from './chatSlice'
import messageStatusReducer from './messageStatusSlice'
import userProfileReducer from './userProfileSlice'
import activePanelReducer from './activePanelSlice'
import settingsReducer from './settingSlice'
import requestListReducer from './requestListSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messageStatus: messageStatusReducer,
        userprofile: userProfileReducer,
        activePanel: activePanelReducer,
        settings: settingsReducer,
        requestlist: requestListReducer
    }
})

export default store;