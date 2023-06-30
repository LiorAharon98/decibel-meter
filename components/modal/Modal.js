import React from "react";
import styles from "./modal.module.css";
import { useSelector,useDispatch } from "react-redux";
import { modalErrorAction } from "../../store/reduxStore";
const Modal = () => {
  const { error } = useSelector((state) => state.modalError);
  const dispatch = useDispatch()
  const closeModal = () => {
   dispatch(modalErrorAction.setError(''))
  };
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
