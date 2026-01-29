import React, { useState } from 'react'
// import styles from './Loading.module.css'
import './Loading.css'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function Loading({font_Size = "30px"}) {
  return (

    <div className="loading-page" >
      <div className="loading" style={{fontSize: font_Size}}>LOADING....</div>
    </div>
  )
}

export default Loading