import getTime from "./currentTime";
import { modalErrorAction } from "../store/reduxStore";
const checkAndCompareDecibelByTime = (loop, user, decibel, dispatch, lastMin) => {
  const dbDiff = 35;
  if (user.current.length === 0) return;
  const currentDate = getTime().substring(10, 15); // get current time
  const currentDecibelDate = user.current?.find((dbDate) => {
    return dbDate.time.substring(10, 15) == "13:58";
  });
  if (!currentDecibelDate) return;
  //restart test at end of loop
  if (decibel.decibelNumHistoryArr.length == loop) {
    decibel.decibelNumHistoryArr = [];
  }
  // first run
  if (decibel.decibelNumHistoryArr.length > 0) {
    //register alarms
    if (
      decibel.currentDecibelNum > Number(lastMin.avg + dbDiff) ||
      decibel.currentDecibelNum < Number(lastMin.avg - dbDiff)
    ) {
      lastMin.alarm = true;
    }
  }

  //   // live test
  if (user.current?.length * 240 > 0 && decibel.decibelNumHistoryArr.length > 0) {
    //check current avg with default avg
    if (lastMin.avg > currentDecibelDate.avg + dbDiff || lastMin.avg < currentDecibelDate.avg - dbDiff) {
      dispatch(modalErrorAction.setError("current state is not the same as default"));
    }
  }

  //     //check if any hard changes made during the current state\\
  if (
    decibel.currentDecibelNum > Number(lastMin.avg + dbDiff) ||
    decibel.currentDecibelNum < Number(lastMin.avg - dbDiff)
  ) {
    console.log("sudden db change noticed");
    //if yes, check if alarm is familiar
    if (!currentDecibelDate.alarm) {
      console.log("alarm is not familiar");
      //if not, compare current db with avg specific time and Max in user database
      if (decibel.currentDecibelNum > currentDecibelDate.avg + dbDiff) {
        dispatch(modalErrorAction.setError(`${currentDecibelDate?.time} High volume detected `));
      }
    }
  }

  //if not, compare current db with avg specific time and Min in user database
  if (decibel.currentDecibelNum < currentDecibelDate.avg - dbDiff) {
    dispatch(modalErrorAction.setError(`${currentDecibelDate.date} Low volume detected:${decibel.currentDecibelNum} `));
  }

  if (currentDecibelDate?.alarm) {
    console.log("alarm is familiar");
    if (decibel.currentDecibelNum > currentDecibelDate.max + dbDiff) {
      dispatch(
        modalErrorAction.setError(`${currentDecibelDate.time} volume way too high:${decibel.currentDecibelNum} `)
      );
    }
  }
  //if not, compare current db with avg specific time and Min in user database
  if (decibel.currentDecibelNum < currentDecibelDate.min - dbDiff) {
    dispatch(modalErrorAction.setError(`${currentDecibelDate.time} volume way too low:${decibel.currentDecibelNum} `));
  }
};

export default checkAndCompareDecibelByTime;
