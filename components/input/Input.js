import React, { forwardRef } from "react";
import styles from "./inp.module.css";
const Input = forwardRef((props,ref) => {
  return <input type={props.type} className={styles.inp} placeholder={props.placeHolder} ref={ref} onChange={props.onChange} />;
});
export default Input;
