import React, { useState } from 'react'
// import styles from './Loading.module.css'
import './Loading.css'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function Loading() {
  const [emoji,setEmoji] = useState("")
  console.log(emoji)
  return (

    // <div className="loading-page">
    //   <div className="loading">LOADING....</div>
    // </div>
    <Picker data={data} onEmojiSelect={(e) => setEmoji(e.native)} />
  )
}

export default Loading