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

  const { addUser } = useDataProvider();

  const clickHandler = async (e) => {
    e.preventDefault();


    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      decibelHistory: [],
    };

    const response = await addUser(user);
    if (!response) return alert("user already exist");
    router.push(`/signin`);
  };

  return (
    <SignCard page={"sign-up"}>
      <h1>sign up</h1>
      <Input placeHolder="enter username" ref={usernameRef} />
      <Input type={'password'} placeHolder="enter password" ref={passwordRef} />


      <Button onClick={clickHandler}>sign up</Button>
    </SignCard>
  );
};

export default SignUp;
