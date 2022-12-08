import React from "react";
import styles from "./decibel_analyzer.module.css";
import { useDataProvider } from "../../context/Data";
const DecibelAnalyzer = ({ type, children }) => {
  const { chooseSelectedArr, lastMin } = useDataProvider();

  return (
    <>
      <div className={type === "profile" ? styles.container_profile : styles.container}>
        <div className={type === "profile" ? styles.container_profile : styles.container_history_num}>
          {type !== "profile" &&
            lastMin.current.map((num, index) => {
              return (
                <p key={index} style={{ height: `${num}%` }} className={styles.history_num}>
                  {" "}
                </p>
              );
            })}
          {children}

          {lastMin.current.map((value, index) => {
            return (
              <div key={index} onClick={chooseSelectedArr} className={styles.profile_tag}>
                {value.date}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DecibelAnalyzer;
