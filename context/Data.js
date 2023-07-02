import { useContext, createContext, useEffect, useMemo } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import getTime from "./currentTime";
import { userAction } from "../store/reduxStore";
import { audioFunc } from "./createAudioPermissionAndRecord";
export const DataContext = createContext();

export const useDataProvider = () => {
  return useContext(DataContext);
};

const DataProvider = ({ children }) => {
  const dispatch = useDispatch();
  const serverUrl =
    process.env.NODE_ENV === "development" ? process.env.NEXT_PUBLIC_LOCAL_URL : process.env.NEXT_PUBLIC_HEROKU_URL;
    console.log(process.env.NODE_ENV)
    console.log(serverUrl)
  const lastMin = useMemo(() => {
    return {
      current: [], // array of db of current minute
      daily: [], // array of objects of detailed minute
      sum: 0,
      avg: 0,
      alarm: false,
      max: 0,
      min: 999,
    };
  }, []);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("key"));
    if (data) {
      dispatch(userAction.signIn(data));
    }
  }, []);

  const handleLastMin = (decibel) => {
    // for first run ONLY
    if (
      decibel.decibelNumHistoryArr.length !== 0 &&
      decibel.decibelNumHistoryArr.length % 240 == 0 //every minute
    ) {
      lastMin.daily.push({
        time: getTime(),
        avg: lastMin.avg,
        max: lastMin.max,
        min: lastMin.min,
        alarm: lastMin.alarm,
      }),
        (lastMin.alarm = false);
    }
  };
  const createDecibelHistory = async (decibel, loop, testName, user) => {
    if (
      user.current.length === 0 &&
      decibel.decibelNumHistoryArr.length <= loop &&
      decibel.decibelNumHistoryArr.length !== 0 &&
      decibel.decibelNumHistoryArr.length % 240 == 0
    ) {
      console.log("added to Data-Base", lastMin.daily);
      const userToFetch = { username: user.username, password: user.password, arr: lastMin.daily, testName };
      const response = await axios.put(`${serverUrl}user2`, userToFetch);
      dispatch(userAction.addDecibelArr(response.data));

      lastMin.daily = []; //re-generate daily
      if (decibel.decibelNumHistoryArr.length == loop) {
        audioFunc.stop();
        return alert(`${testName} test done registering`);
      }
    }
  };

  const selectedUser = async (createdUser) => {
    const response = await axios.post(`${serverUrl}user2`, createdUser);
    if (response.data) dispatch(userAction.signIn(response.data));
    return response.data;
  };

  const addCurrentArr = (user, arr) => {
    const addedUser = { ...user, current: arr.testNameArr };
    sessionStorage.setItem("key", JSON.stringify(addedUser));
  };
  const fetchTestName = async (username, timeLapse, testName) => {
    const createdTest = { username, testName, timeLapse };

    const response = await axios.put(`${serverUrl}user`, createdTest);
    return response.data;
  };
  const addUser = async (user) => {
    const response = await axios.post(`${serverUrl}user`, user);
    return response.data;
  };

  const value = {
    addCurrentArr,
    lastMin,
    handleLastMin,
    createDecibelHistory,
    addUser,
    fetchTestName,
    lastMin,
    selectedUser,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export default DataProvider;
