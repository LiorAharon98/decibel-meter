import { useDataProvider } from "../context/Data";
import { useRouter } from "next/router";
import Input from "../components/input/Input";
import styles from "../styles/profile.module.css";
import Button from "../components/button/Button";
const Profile = () => {
  const router = useRouter();
  const { fetchTestName, user, setUser, setTestName, testName } = useDataProvider();
  
  const clickHandler = (e) => {
    e.preventDefault();
    if (!testName) return alert("cannot be empty");
    fetchTestName();
    router.push(`/${user.username}`);  
  };
  const currentTest = (username) => {
    const findTest = user.decibelHistory.find((value) => {
      return value.testName == username;
    });

    setUser((prev) => {
      return { ...prev, current: findTest.testNameArr };
    });
    router.push(`/${user.username}`);
  };

  return (
    <>
      <div className={styles.page_container}>
        <div className={styles.container}>
          <h1> hello {user.username}</h1>
          <Input
            placeHolder="enter test name"
            onChange={(e) => {
              setTestName(e.target.value);
            }}
          />
          {user.decibelHistory && user.decibelHistory.map((value, index) => {
            return (
              <Button onClick={currentTest.bind(this, value.testName)} className={styles.test_tag} key={index}>
                {value.testName}
              </Button>
            );
          })}
          <div>
            <Button link={"user"} onClick={clickHandler}>
              create new test
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
