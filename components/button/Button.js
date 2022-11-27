import React from 'react'
import Link from 'next/link'
import styles from "./button.module.css"
const Button = ({link,onClick,children,style}) => {
  return (
    <Link style={style} className={styles.button} href={`/${link}`} onClick={onClick} >{children}</Link>
  )
}

export default Button