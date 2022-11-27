import React, { useRef } from "react";
import DecibelAnalyzer from "../components/decibel_analyzer/DecibelAnalyzer";
import { useDataProvider } from "../context/Data";
import Link from "next/link";
import styles from "../styles/profile.module.css";
const Profile = () => {
  const { fetchTestName, user } = useDataProvider();
  const testRef = useRef();

  const clickHandler = () => {
    fetchTestName(testRef.current.value);
  };

  const userTestNames = user.decibelHistory.map((value) => {
    return Object.keys(value);
  });
  return (
    <>
      <div className={styles.page_container}>
        <DecibelAnalyzer arr={user.decibelHistory} type="profile">
          <h1> hello {user.name}</h1>
          <input type={"text"} placeholder="test name" ref={testRef} />
          {userTestNames.map((value,index) => {
            return <div key={index} >{value}</div>;
          })}
          <Link onClick={clickHandler} href={`${user.name}`}>
            create new test
          </Link>
        </DecibelAnalyzer>
      </div>
    </>
  );
};

export default Profile;
