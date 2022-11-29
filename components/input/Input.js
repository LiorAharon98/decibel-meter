import React, { forwardRef } from "react";
import styles from "./inp.module.css";
const Input = forwardRef((props,ref) => {
  return <input  className={styles.inp} placeholder={props.placeHolder} ref={ref} />;
});
export default Input;
