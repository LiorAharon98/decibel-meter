import React, { useRef } from "react";
import Input from "../components/input/Input";
import Button from "../components/button/Button";
import styles from "./../styles/create_test.module.css";
import { useDataProvider } from "../context/Data";
import { useRouter } from "next/router";
const CreateTest = () => {
  const { fetchTestName, testName, user, setTestName } = useDataProvider();
  const router = useRouter();
  const timeLapseRef = useRef();
  const timeLapseTypeRef = useRef();
  const clickHandler = async (e) => {
    e.preventDefault();
    const timeCheck = timeLapseTypeRef.current.value;
    const timeFinish = Number(timeLapseRef.current.value) * timeCheck;
    if (!testName) return alert("cannot be empty");
    await fetchTestName(timeFinish);
    router.push(`/${user.username}`);
  };
  return (
    <div className={styles.page_container}>
      <div className={styles.container}>
        <Input
          placeHolder="enter test name"
          onChange={(e) => {
            setTestName(e.target.value);
          }}
        />
        <Input type={"number"} placeHolder="enter timelapse length" ref={timeLapseRef} />
        <select
          className={styles.select}
          defaultValue={"seconds"}
          ref={timeLapseTypeRef}
          name="timelapse"
          id="timelapse"
        >
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
        <Button link={"user"} onClick={clickHandler}>
          create new test
        </Button>
      </div>
    </div>
  );
};

export default CreateTest;
