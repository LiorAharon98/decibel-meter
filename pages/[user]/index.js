import DecibelMeterContainer from "../../components/decibel_meter_container/DecibelMeterContainer";
import styles from "../../styles/decibel_meter.module.css";
import DecibelAnalyzer from "../../components/decibel_analyzer/DecibelAnalyzer";
import StartOrPauseBtn from "../../components/start_or_pause_btn/StartOrPauseBtn";
import FrequencyAnalyzer from "../../components/frequency analyzer/FrequencyAnalyzer";
import UserDecibelInfo from "../../components/user_decibel_info/UserDecibelInfo";
import Modal from "../../components/modal/Modal";
import HasDecibelHistory from "../../components/has_decibel_history/HasDecibelHistory";
import { useSelector } from "react-redux";
const DecibelMeter = () => {
  const user = useSelector(state=>state.user)
  console.log(user)
  return (
    <>
      <Modal />
      <UserDecibelInfo />
      <div className={styles.container}>
        <div className={styles.meter_container}>
          <HasDecibelHistory />
          <StartOrPauseBtn />
           <div className={styles.decibel_meter_container}>

          <DecibelMeterContainer />
           </div>
        </div>
      </div>

      <DecibelAnalyzer />

      <FrequencyAnalyzer />
    </>
  );
};

export default DecibelMeter;
