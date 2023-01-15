import styles from "../styles/Home.module.css";
import Button from "../components/button/Button";
import SignCard from "../components/sign_card/SignCard";

const Home = () => {
  return (
    <div className={styles.container}>
      <SignCard>
        <Button link={"signin"}>sign in</Button>
        <Button link={"signup"}>sign up</Button>
      </SignCard>
    </div>
  );
};
export default Home;
