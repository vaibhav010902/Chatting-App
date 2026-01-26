import React, { useState } from 'react'
// import styles from './Loading.module.css'
import './Loading.css'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

function Loading() {
  return (

    <div className="loading-page">
      <div className="loading">LOADING....</div>
    </div>
  )
}

export default Loading