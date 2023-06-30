import React from "react";
import {useSelector } from "react-redux";
import styles from "./frequency_analyzer.module.css";
const FrequencyAnalyzer = () => {
const {frequency} = useSelector((state)=>state.frequency)
  return (
    <div className={styles.page_container}>
      <div className={styles.container}>
        {frequency?.map((num, index) => {
          return <div key={index} className={styles.frequency_tag} style={{ height: `${num}px` }}></div>;
        })}
      </div>
    </div>
  );
};

export default FrequencyAnalyzer;
