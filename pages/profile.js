import { useRouter } from "next/router";
import styles from "../styles/profile.module.css";
import Button from "../components/button/Button";
import { useSelector, useDispatch } from "react-redux";
import { testNameAction, userAction } from "../store/reduxStore";
import { useDataProvider } from "../context/Data";
const Profile = () => {
  const { addCurrentArr } = useDataProvider();
  const router = useRouter();
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const currentTest = (testName) => {
    const findTest = userSelector.decibelHistory.find((value) => {
      return value.testName == testName;
    });
    dispatch(testNameAction.getTestName(findTest));
    dispatch(userAction.addCurrentArr(findTest.testNameArr));
    addCurrentArr(userSelector, findTest);
    router.push(`/${userSelector.username}`);
  };
  return (
    <div className={styles.page_container}>
      <div className={styles.container}>
        {<h1> hello {userSelector.username}</h1>}
        <div className={styles.test_container}>
          {userSelector.decibelHistory &&
            userSelector.decibelHistory.map((value, index) => {
              return (
                <Button
                  style={{ height: "60px", width: "100px", marginBottom: "10px" }}
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
