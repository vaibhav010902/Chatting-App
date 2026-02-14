import React from 'react'
import styles from './NavbarMobileView.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { setActivePanel } from '../../store/activePanelSlice'

function NavbarMobileView() {
    const dispatch = useDispatch();
    const activePanel = useSelector(state => state.activePanel.name);
    const unreadMsg = useSelector(state => state.messageStatus.totalUnread);
    const requestList = useSelector(state => state.requestlist.requestList);

    return (
        <>
            <div className={styles.btn_container}>
                <div 
                    className={styles.chat_btn_container}
                    onClick={() => dispatch(setActivePanel("Friends"))}
                    // style={{borderBottom: activePanel === "Friends"? "2px solid black" : "none"}}
                    style={{backgroundColor: activePanel === "Friends"? "rgb(245,245,245)" : "none"}}
                >
                    {unreadMsg > 0 && <p className={styles.notification_indicator}>{unreadMsg}</p>}
                    <span className={styles.chat_btn}>Chat</span>
                </div>
                <div 
                    className={styles.contact_btn_container}
                    onClick={() => dispatch(setActivePanel("Contacts"))}
                    style={{backgroundColor: activePanel === "Contacts"? "rgb(245,245,245)" : "none"}}
                >
                    {/* <p className={styles.notification_indicator}>12</p> */}
                    <span className={styles.contact_btn}>Add</span>
                </div>
                <div 
                    className={styles.group_btn_container}
                    onClick={() => dispatch(setActivePanel("Groups"))}
                    style={{backgroundColor: activePanel === "Groups"? "rgb(245,245,245)" : "none"}}
                >
                    {/* <p className={styles.notification_indicator}>12</p> */}
                    <span className={styles.group_btn}>Group</span>
                </div>
                <div 
                    className={styles.request_btn_container}
                    onClick={() => dispatch(setActivePanel("Requests"))}
                    style={{backgroundColor: activePanel === "Requests"? "rgb(245,245,245)" : "none"}}
                >
                    {requestList.length > 0 && <p className={styles.notification_indicator}>{requestList.length}</p>}
                    <span className={styles.request_btn}>Request</span>
                </div>
            </div>
        </>
    )
}

export default NavbarMobileView