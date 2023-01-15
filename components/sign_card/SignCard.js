import React from "react";
import styles from "./sign_card.module.css";
const SignCard = ({ children,page }) => {
  return (
    <div className={styles.container_page}>
      <div className={page === 'sign-up' ? styles.sign_up_container : styles.container}>{children}</div>
    </div>
  );
};

export default SignCard;
