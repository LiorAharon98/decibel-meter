import React from "react";
import styles from "./decibel_analyzer.module.css";
import { useDataProvider } from "../../context/Data";
import { useSelector } from "react-redux";
const DecibelAnalyzer = ({ children }) => {
  const { lastMin } = useDataProvider();
  const selector = useSelector((state) => state.decibel);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.container_history_num}>
          {lastMin.current.map((num, index) => {
            return (
              <p key={index} style={{ height: `${num}%` }} className={styles.history_num}>
                {" "}
              </p>
            );
          })}
          {children}
        </div>
      </div>
    </>
  );
};

export default DecibelAnalyzer;
