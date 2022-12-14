import React, { useRef } from "react";
import { useRouter } from "next/router";
import { useDataProvider } from "../context/Data";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import SignCard from "../components/sign_card/SignCard";
const SignIn = () => {
  const { selectedUser, setUser} = useDataProvider();
  const router = useRouter();
  const nameRef = useRef();
  const passwordRef = useRef();

  const clickHandler = async (e) => {
    e.preventDefault();
    const createdUser = {
      name: nameRef.current.value,
      password: passwordRef.current.value,
      arrHistory: [],
    };
    const user = await selectedUser(createdUser);
    if (!user) return alert("not found");
    sessionStorage.setItem("key", JSON.stringify(user))
    setUser(user);
    router.push(`/${user.name}`);
  };
  return (
    <SignCard>
      <h1>sign in</h1>
      <Input placeHolder="enter name" ref={nameRef} />
      <Input placeHolder="enter password" ref={passwordRef} />
      <Button style={{ backgroundColor: "black" }} onClick={clickHandler}>
        log in
      </Button>
    </SignCard>
  );
};

export default SignIn;
