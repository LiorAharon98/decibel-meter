import React, { useState, useEffect, useCallback } from "react";
import DecibelMeterDetails from "../../components/decibel_meter_details/DecibelMeterDetails";
import styles from "../../styles/decibel_meter.module.css";
import DecibelAnalyzer from "../../components/decibel_analyzer/DecibelAnalyzer";
import { useDataProvider } from "../../context/Data";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import FrequencyAnalyzer from "../../components/frequency analyzer/FrequencyAnalyzer";
const DecibelMeter = () => {
  const { createAudioPermissionAndRecord, checkAndCompareDecibelByTime, setUser, isStart, start, stop, decibel, user } =
    useDataProvider();
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("key"));
    setUser(data);
  }, []);

  useEffect(() => {
    createAudioPermissionAndRecord();
  }, [user]);
  useEffect(() => {
    checkAndCompareDecibelByTime();
  }, [decibel]);
  const clickHandler = (e) => {
    e.preventDefault();
    isStart ? stop() : start();
  };

  return (
    <>
      <Modal />
      <div className={styles.container}>
        <div className={styles.meter_container}>
          {Object.keys(user).length > 0 && (
            <h3> has decibel history ? {user.decibelHistory.length > 0 ? "yes" : "no"}</h3>
          )}
          <Button onClick={clickHandler}>{isStart ? "pause" : "start"}</Button>

          <DecibelMeterDetails type={"current"} num={decibel.currentDecibelNum} />
          <div className={styles.min_max_decibel}>
            <DecibelMeterDetails type={"min"} num={decibel.minDecibelNum} />
            <DecibelMeterDetails type={"max"} num={decibel.maxDecibelNum} />
          </div>
        </div>
      </div>
      <DecibelAnalyzer />
      <FrequencyAnalyzer />
    </>
  );
};

export default DecibelMeter;
