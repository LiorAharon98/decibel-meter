import React from "react";
import { useSelector } from "react-redux";
import styles from "./has_decibel.module.css"
const HasDecibelHistory = () => {
  const userSelector = useSelector((state) => state.user);
  const { testName } = useSelector((state) => state.testName);
  return (
    <>
      <h2 className={styles.tag}> current test : {testName.testName}</h2>
      <h3 className={styles.tag}> has decibel history ? {userSelector?.current?.length > 0 ? "yes" : "no"}</h3>
      <h3 className={styles.tag}> how many minuets : {userSelector?.current?.length}</h3>
      <h3 className={styles.tag}> start time : {userSelector?.current[0]?.time.substring(10,15)}</h3>
    </>
  );
};

export default HasDecibelHistory;
