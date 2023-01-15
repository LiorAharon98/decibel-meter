import React, { useState, useRef } from "react";

import Button from "../components/button/Button";
import Input from "../components/input/Input";
import axios from "axios";
import styles from "../styles/sign_up.module.css";
import SignCard from "../components/sign_card/SignCard";
import { useRouter } from "next/router";
import { useDataProvider } from "../context/Data";
const SignUp = () => {
  const router = useRouter();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const timeLapseRef = useRef();
  const timeLapseTypeRef = useRef();
  const { herokuUrl, localUrl } = useDataProvider();

  const addUser = async (e) => {
    e.preventDefault();
    const timeCheck = timeLapseTypeRef.current.value;
    const timeFinish = Number(timeLapseRef.current.value) * timeCheck;

    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      decibelHistory: [],
      timeLapse: timeFinish,
    };
    const response = await (await axios.post(`${localUrl}user`, user)).data;

    if (!response) return alert("user already exist");
    router.push(`/signin`);
  };

  return (
    <SignCard page={'sign-up'}>
      <h1>sign up</h1>
      <Input placeHolder="enter username" ref={usernameRef} />
      <Input placeHolder="enter password" ref={passwordRef} />
      <Input type={'number'} placeHolder="enter timelapse length" ref={timeLapseRef} />
      <select className={styles.select} defaultValue={"seconds"} ref={timeLapseTypeRef} name="timelapse" id="timelapse">
        <option className={styles.option} value={4}>
          seconds
        </option>
        <option className={styles.option} value={240}>
          minutes
        </option>
        <option className={styles.option} value={14400}>
          hours
        </option>
        <option className={styles.option} value={345600}>
          days
        </option>
      </select>

      <Button onClick={addUser}>sign up</Button>
    </SignCard>
  );
};

export default SignUp;
