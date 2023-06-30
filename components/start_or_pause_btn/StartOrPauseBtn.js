import React, { useState, useEffect } from "react";
import Button from "../button/Button";
import { audioFunc } from "../../context/createAudioPermissionAndRecord";
const StartOrPauseBtn = () => {
  const [isStart, setIsStart] = useState(false);

  const clickHandler = (e) => {
    e.preventDefault();
    setIsStart(!isStart);
  };
  useEffect(() => {
    isStart ? audioFunc.start() : audioFunc.stop();
  }, [isStart]);
  return <Button onClick={clickHandler}>{isStart ? "pause" : "start"}</Button>;
};

export default StartOrPauseBtn;
