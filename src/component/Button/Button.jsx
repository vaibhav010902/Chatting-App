import React from 'react'
import styles from './Button.module.css'

function Button({text, ...props}) {
  return (
    <button className={styles.btn} {...props}>{text}</button>
  )
}

export default Button