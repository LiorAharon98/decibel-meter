import { useDataProvider } from "../context/Data";
import { useRouter } from "next/router";
import styles from "../styles/profile.module.css";
import Button from "../components/button/Button";
const Profile = () => {
  const router = useRouter();
  const { user, setUser } = useDataProvider();

  const currentTest = (username) => {
    const findTest = user.decibelHistory.find((value) => {
      return value.testName == username;
    });

    setUser((prev) => {
      return { ...prev, current: findTest.testNameArr };
    });
    router.push(`/${user.username}`);
  };
  console.log(user);
  return (
    <div className={styles.page_container}>
      <div className={styles.container}>
        {<h1> hello {user.username}</h1>}
        <div className={styles.test_container}>
          {user.decibelHistory &&
            user.decibelHistory.map((value, index) => {
              return (
                <Button
                  style={{ height: "80px", width: "120px", marginBottom: "10px" }}
                  onClick={currentTest.bind(this, value.testName)}
                  className={styles.test_tag}
                  key={index}
                >
                  {value.testName}
                </Button>
              );
            })}
        </div>
        <div>
          <Button link={"createTest"}>create new test?</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
