import React, { useRef } from "react";
import DecibelAnalyzer from "../components/decibel_analyzer/DecibelAnalyzer";
import { useDataProvider } from "../context/Data";
import { useRouter } from "next/router";
import Input from "../components/input/Input";
import styles from "../styles/profile.module.css";
const Profile = () => {
  const router = useRouter();
  const { fetchTestName, user, setUser } = useDataProvider();
  const testRef = useRef();

  const clickHandler = () => {
    const testInp = testRef.current.value;
    if (!testInp) return alert("cannot be empty");
    fetchTestName(testInp);
    router.push(`/${user.name}`);
  };
  const currentTest = (name) => {
    const findTest = user.decibelHistory.find((value) => {
      return Object.keys(value) == name[0];
    });
    setUser((prev) => {
      return { ...prev, current: findTest };
    });
    router.push(`/${user.name}`);
  };

  const userTestNames = user.decibelHistory.map((value) => {
    return Object.keys(value);
  });
  return (
    <>
      <div className={styles.page_container}>
        <DecibelAnalyzer arr={user.decibelHistory} type="profile">
          <h1> hello {user.name}</h1>
          <Input placeHolder="enter test name" ref={testRef} />
          {userTestNames.map((value, index) => {
            return (
              <div onClick={currentTest.bind(this, value)} className={styles.test_tag} key={index}>
                {value}
              </div>
            );
          })}
          <div className={styles.create_test_btn} onClick={clickHandler} href={`${user.name}`}>
            create new test
          </div>
        </DecibelAnalyzer>
      </div>
    </>
  );
};

export default Profile;
