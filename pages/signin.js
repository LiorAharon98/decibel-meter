import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import { useDataProvider } from "../context/Data";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import SignCard from "../components/sign_card/SignCard";
const SignIn = () => {
  const { selectedUser } = useDataProvider();

  const router = useRouter();
  const nameRef = useRef();
  const passwordRef = useRef();
  const [error, serError] = useState("");
  const clickHandler = async (e) => {
    e.preventDefault();
    const createdUser = {
      name: nameRef.current.value,
      password: passwordRef.current.value,
      arrHistory: [],
    };
    const user = await selectedUser(createdUser);
    if (!user) return serError("user not found!");
    sessionStorage.setItem("key", JSON.stringify(user));
    router.push(`/profile`);
  };
  return (
    <SignCard>
      <h1>sign in </h1>
      <Input placeHolder="enter name" ref={nameRef} />
      <Input type={"password"} placeHolder="enter password" ref={passwordRef} />
      <Button style={{ backgroundColor: "black" }} onClick={clickHandler}>
        log in
      </Button>
      {error && <h3>{error}</h3>}
    </SignCard>
  );
};

export default SignIn;
