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
  const nameRef = useRef();
  const passwordRef = useRef();
  const timeLapseRef = useRef();
  const timeLapseTypeRef = useRef();
  const { herokuUrl, localUrl } = useDataProvider();

  const addUser = async (e) => {
    e.preventDefault();
    const timeCheck = timeLapseTypeRef.current.value;
    const timeFinish = Number(timeLapseRef.current.value) * timeCheck;

    const user = {
      name: nameRef.current.value,
      password: passwordRef.current.value,
      decibelHistory: [],
      timeLapse: timeFinish,
    };
    const response = await axios.post(`${herokuUrl}user`, user);

    const checkUser = response.data;
    if (!checkUser) return alert("user already exist");
    router.push(`/signin`);
  };

  return (
    <SignCard>
      <h1>sign up</h1>
      <Input placeHolder="enter name" ref={nameRef} />
      <Input placeHolder="enter password" ref={passwordRef} />
      <Input placeHolder="enter timelapse length" ref={timeLapseRef} />
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
