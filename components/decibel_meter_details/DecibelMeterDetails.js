import styles from "./decibel_meter_details.module.css";
const DecibelMeterDetails = ({ type, num }) => {
  return (
    <div>
      
      <p className={styles.decibel_num}>{type}</p>
      <p className={styles.decibel_num}>{num ==999 ? 0 : num} dB</p>
    </div>
  );
};

export default DecibelMeterDetails;
