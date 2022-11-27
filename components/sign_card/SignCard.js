import React from "react";
import styles from "./sign_card.module.css";
const SignCard = ({ children }) => {
  return (
    <div className={styles.container_page}>
      <div className={styles.container}>{children}</div>
    </div>
  );
};

export default SignCard;
