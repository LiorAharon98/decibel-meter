import DecibelMeterDetails from "../decibel_meter_details/DecibelMeterDetails";
import { useSelector } from "react-redux";
import style from "./decibel_meter_container.module.css";
const DecibelMeterContainer = () => {
  const { currentDecibelNum, minDecibelNum, maxDecibelNum } = useSelector((state) => state.decibel);

  return (
    <>
      <div>
        <DecibelMeterDetails num={currentDecibelNum} type={"current"} />
      </div>
      <div className={style.min_max_container}>
        <DecibelMeterDetails num={minDecibelNum} type={"min"} />
        <DecibelMeterDetails num={maxDecibelNum} type={"max"} />
      </div>
    </>
  );
};

export default DecibelMeterContainer;
