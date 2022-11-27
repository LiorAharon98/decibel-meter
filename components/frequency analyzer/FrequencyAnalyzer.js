import React from "react";
import { useDataProvider } from "../../context/Data";
import styles from "./frequency_analyzer.module.css";
const FrequencyAnalyzer = () => {
  const { frequencyArr } = useDataProvider();

  return (
    <div className={styles.page_container}>
      <div className={styles.container}>
        {frequencyArr.map((num, index) => {
          return <div key={index} className={styles.frequency_tag} style={{ height: `${num}px` }}></div>;
        })}
      </div>
    </div>
  );
};

export default FrequencyAnalyzer;
