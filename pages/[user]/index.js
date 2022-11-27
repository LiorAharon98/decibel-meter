import React, { useState, useEffect } from "react";
import DecibelMeterDetails from "../../components/decibel_meter_details/DecibelMeterDetails";
import styles from "../../styles/decibel_meter.module.css";
import DecibelAnalyzer from "../../components/decibel_analyzer/DecibelAnalyzer";
import { useDataProvider } from "../../context/Data";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import FrequencyAnalyzer from "../../components/frequency analyzer/FrequencyAnalyzer";
const DecibelMeter = () => {
  const { setUser, isStart, start, stop, decibel, lastMin, createAudioPermissionAndRecord, user } =
    useDataProvider();
  useEffect(() => {
    typeof window !== "undefined" ? createAudioPermissionAndRecord() : false;

    const data = sessionStorage.getItem("key");

   setUser(JSON.parse(data));
  }, []);
  const clickHandler = (e) => {
    e.preventDefault();
    isStart ? stop() : start();
  };

  return (
    <>
      <Modal />
      <div className={styles.container}>
        <div className={styles.meter_container}>
          {user && <h3> has decibel history ? {user.decibelHistory.length !== 0 ? "yes" : "no"}</h3>}
          <Button onClick={clickHandler}>{isStart ? "pause" : "start"}</Button>

          <DecibelMeterDetails type={"current"} num={decibel.currentDecibelNum} />
          <div className={styles.min_max_decibel}>
            <DecibelMeterDetails type={"min"} num={decibel.minDecibelNum} />
            <DecibelMeterDetails type={"max"} num={decibel.maxDecibelNum} />
          </div>
        </div>
      </div>
      <DecibelAnalyzer arr={lastMin.current} />
      <FrequencyAnalyzer />
    </>
  );
};

export default DecibelMeter;
