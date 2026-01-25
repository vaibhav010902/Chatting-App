import React from 'react'
import styles from './ContactTile.module.css'

function ContactTile({ contact_name, contact_msg , profile_image,...props}) {
    return (
        <div className={styles.contact_tile_container} {...props}>
            <div className={styles.contact_tile_main_container}>
                <div className={styles.contact_profile_container}>
                    <div className={styles.contact_image}>
                        <img 
                            className="material-symbols-outlined"
                            style={{width:"45px", height:"45px", border:"1px solid black", borderRadius:"50%", alignContent:"center", objectFit:"cover"}}
                            src={profile_image ? profile_image : "https://in.pinterest.com/pin/660832945362593473/"}
                        />
                            {/* account_circle */}
                        {/* </img>  */}
                    </div>
                    <div className={styles.contact_name_and_message_container}>
                        <p className={styles.contact_name}>{contact_name}</p>
                        <p className={styles.contact_msg}>{contact_msg}</p>
                    </div>
                </div>
                <div className={styles.contact_tile_btn_container}>
                    <span className="material-symbols-outlined">
                        more_vert
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ContactTile