import React from "react";
import { useDataProvider } from "../../context/Data";
import styles from "./modal.module.css";
const Modal = () => {
  const { error, closeModal } = useDataProvider();
  return (
    <div className={error ? styles.page_container : styles.container_inactive}>
      <div className={error ? styles.container : styles.container_inactive}>
        <h3>{error}</h3>
        <div onClick={closeModal}>close</div>
      </div>
    </div>
  );
};

export default Modal;
