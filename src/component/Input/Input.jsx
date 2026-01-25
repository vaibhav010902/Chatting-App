import React, {useId, forwardRef} from 'react'
import styles from './Input.module.css'

function Input({label, type="type", placeholder,className, ...props}, ref) {
    const ID = useId();
    
  return (
    <div className={styles.input_container}>
        {label && 
        <label 
          htmlFor={ID}
          className={styles.input_label}
        >
          {label}
        </label>}
        <input 
          type={type}
          placeholder={placeholder}
          className={`${styles.input_input_box} ${className}`}
          id={ID}
          ref={ref}
          {...props}
        />
    </div>
  )
}

export default forwardRef(Input)