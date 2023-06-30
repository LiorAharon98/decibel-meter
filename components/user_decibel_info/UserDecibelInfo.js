import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDataProvider } from "../../context/Data";
import createAudioPermissionAndRecord from "../../context/createAudioPermissionAndRecord";
import checkAndCompareDecibelByTime from "../../context/checkAndCompareDecibelByTime";
const UserDecibelInfo = () => {
  const dispatch = useDispatch();
  const { lastMin, handleLastMin, createDecibelHistory } = useDataProvider();
  const { testName } = useSelector((state) => state.testName);
  console.log('w')
  const decibel = useSelector((state) => state.decibel);
  const userSelector = useSelector((state) => state.user);
  const loop = testName?.timeLapse;
  const currentSpec = Math.floor((10 * loop) / 100);
  const handleAudio = async () => {
    await createAudioPermissionAndRecord(loop, dispatch, lastMin);
  };

  useEffect(() => {
    handleAudio(loop, currentSpec, testName);
  }, []);
  useEffect(() => {
    checkAndCompareDecibelByTime(loop, userSelector, decibel, dispatch, lastMin);
    handleLastMin(decibel);
    createDecibelHistory(decibel, loop, testName.testName, userSelector);
  }, [decibel]);
  return <></>;
};

export default UserDecibelInfo;
