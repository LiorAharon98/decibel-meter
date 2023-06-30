import styles from "./decibel_meter_details.module.css";
const DecibelMeterDetails = ({ type, num }) => {
  return (
    <>
      <p className={styles.decibel_num}>
        {type} <br /> { type==='min' && num ===999 ? 0 : num}
      </p>
    </>
  );
};

export default DecibelMeterDetails;
