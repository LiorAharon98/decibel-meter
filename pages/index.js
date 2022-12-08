import styles from "../styles/Home.module.css";
import Button from "../components/button/Button";
import SignCard from "../components/sign_card/SignCard";
import { useDataProvider } from "../context/Data";
const Home = () => {
  const {testing} = useDataProvider()
  return (
    <div className={styles.container}>
      <SignCard>
        <Button style={{backgroundColor : 'black'}} link={"signin"}>sign in</Button>
        <Button style={{backgroundColor : 'black'}} link={"signup"}>sign up</Button>
      {/* <Button onClick={testing} >test</Button> */}
      </SignCard>
    </div>
  );
};
export default Home;
