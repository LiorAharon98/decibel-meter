import { useContext, useState, createContext, useEffect } from "react";
import axios from "axios";
export const DataContext = createContext();
export const useDataProvider = () => {
  return useContext(DataContext);
};

let volumeCallback = null;
let volumeInterval = null;
const DataProvider = ({ children }) => {
  const [frequencyArr, setFrequencyArr] = useState([]);
  const [isStart, setIsStart] = useState(false);
  const [testName, setTestName] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState({});
  const [decibel, setDecibel] = useState({
    currentDecibelNum: 0,
    minDecibelNum: 999,
    maxDecibelNum: 0,
    decibelNumHistoryArr: [],
    dbGraph: [],
  });

  const [lastMin, setLastMin] = useState({
    current: [], // array of db of current minute
    daily: [], // array of objects of detailed minute
    sum: 0,
    avg: 0,
    alarm: false,
    max: 0,
    min: 999,
  });

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("key"));
    if (data) {
      setUser(data);
    }
  }, []);
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      sessionStorage.setItem("key", JSON.stringify(user));
    }
  }, [user]);

  const localUrl = "http://localhost:3000/api/";
  const herokuUrl = "https://next-js-decibel-meter.herokuapp.com/api/";
  const dbDiff = 35;
  const getTime = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getUTCDate();
    const hours = new Date().getHours();
    let minuets = new Date().getMinutes().toString();
    if (minuets.length === 1) {
      minuets = `0${minuets}`;
    }
    return `${year}-${month}-${day}T${hours}:${minuets}`;
  };

  const checkAndCompareDecibelByTime = (loop) => {
    const currentD = getTime(); // get current time
    const tempCurrent = currentD.substring(10, 15); // get only the time without date
    if (Object.keys(user).length == 0) return; // find it in database
    const tempPast = user.current[0].time.substring(0, 10);
    const currentDate = tempPast + tempCurrent;

    const currentDecibelDate = user.current?.find((dbDate) => {
      return dbDate.time == currentDate;
    });
    //restart test at end of loop
    if (decibel.decibelNumHistoryArr.length == loop) {
      decibel.decibelNumHistoryArr = [];
    }
    // first run
    if (!user.current && decibel.decibelNumHistoryArr.length > 0) {
      //register alarms
      if (
        decibel.currentDecibelNum > Number(lastMin.avg + dbDiff) ||
        decibel.currentDecibelNum < Number(lastMin.avg - dbDiff)
      ) {
        lastMin.alarm = true;
      }
    }

    // live test
    if (user.current?.length * 240 > 0 && decibel.decibelNumHistoryArr.length > 0 && currentDecibelDate) {
      //check current avg with default avg
      if (lastMin.avg > currentDecibelDate.avg + dbDiff || lastMin.avg < currentDecibelDate.avg - dbDiff) {
        setError("current state is not the same as default");
      }

      //check if any hard changes made during the current state\\
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
            setError(`${currentDecibelDate.date} High volume detected:${decibel.currentDecibelNum} `);
          }
          //if not, compare current db with avg specific time and Min in user database
          if (decibel.currentDecibelNum < currentDecibelDate.avg - dbDiff) {
            setError(`${currentDecibelDate.date} Low volume detected:${decibel.currentDecibelNum} `);
          }
        }
        if (currentDecibelDate.alarm) {
          console.log("alarm is familiar");
          if (decibel.currentDecibelNum > currentDecibelDate.max + dbDiff) {
            setError(`${currentDecibelDate.date} volume way too high:${decibel.currentDecibelNum} `);
          }
          //if not, compare current db with avg specific time and Min in user database
          if (decibel.currentDecibelNum < currentDecibelDate.min - dbDiff) {
            setError(`${currentDecibelDate.date} volume way too low:${decibel.currentDecibelNum} `);
          }
        }
      }
    }
  };
  // Initialize

  const createAudioPermissionAndRecord = async (loop, currentSpec, currentTest) => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
        },
      });
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaStreamSource(audioStream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.minDecibels = -127;
      analyser.maxDecibels = 0;
      analyser.smoothingTimeConstant = 0.4;
      audioSource.connect(analyser);
      const volumes = new Uint8Array(analyser.frequencyBinCount);
      volumeCallback = () => {
        setFrequencyArr((prev) => {
          return (prev = Array.from(volumes));
        });
        analyser.getByteFrequencyData(volumes);
        let volumeSum = 0;
        for (const volume of volumes) volumeSum += volume;
        const averageVolume = volumeSum / volumes.length;
        // Value range: 127 = analyser.maxDecibels - analyser.minDecibels;
        let decibelNum = (averageVolume * 100) / 127;

        let decibelNumNumber = Number(decibelNum.toFixed(0));

        lastMin.current.push(decibelNumNumber);
        decibel.decibelNumHistoryArr.push(decibelNumNumber);
        decibel.dbGraph.push(decibelNumNumber);

        setDecibel((prev) => {
          return {
            ...prev,
            currentDecibelNum: decibelNumNumber,
            maxDecibelNum: Math.max(decibelNumNumber, prev.maxDecibelNum),
            minDecibelNum: Math.min(decibelNumNumber, prev.minDecibelNum),
            // decibelNumHistoryArr: [...prev.decibelNumHistoryArr, decibelNumNumber],
          };
        });

        //for design
        if (decibel.dbGraph.length > 100) {
          decibel.dbGraph.shift(decibel.dbGraph[0]);
        }

        // GENERATE CURRENT STATE AVG \\
        lastMin.sum += Number(lastMin.current[lastMin.current.length - 1]);
        lastMin.avg = Math.floor(Number(lastMin.sum / lastMin.current.length));
        lastMin.min = Math.min(lastMin.min, Number(lastMin.current[lastMin.current.length - 1]));
        lastMin.max = Math.max(lastMin.max, Number(lastMin.current[lastMin.current.length - 1]));
        if (lastMin.current.length > 240) {
          lastMin.min = 999;
          lastMin.sum = 0;
          lastMin.max = 0;
          lastMin.current = [];
        }

        // GENERATING DAILY ARRAY \\
        if (
          //for first run ONLY
          decibel.decibelNumHistoryArr.length % 240 == 0 && //every minute
          !user.current
        ) {
          lastMin.daily.push({
            time: getTime(),
            avg: lastMin.avg,
            max: lastMin.max,
            min: lastMin.min,
            alarm: lastMin.alarm,
          });
          lastMin.alarm = false;
        }

        //Send to Data-Base\\
        //                for first run ONLY!!!                          &&         every minute
        if (
          !user.current &&
          decibel.decibelNumHistoryArr.length <= loop &&
          decibel.decibelNumHistoryArr.length % 240 == 0
        ) {
          decibelHistoryBtn();
          console.log("added to Data-Base", lastMin.daily);
          lastMin.daily = []; //re-generate daily
          if (decibel.decibelNumHistoryArr.length == loop) {
            return alert(`${currentTest.testName} test done registering`);
          }
        }
      };
    } catch (e) {
      console.error("Failed to initialize volume visualizer, simulating instead...", e);
      let lastVolume = 0;
      volumeCallback = () => {
        const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
        lastVolume = volume;
      };
    }
  };
  const decibelHistoryBtn = async () => {
    const userFromDb = await createDecibelHistory(user.username, user.password, lastMin.daily);
    setUser(userFromDb);
  };

  const start = () => {
    if (volumeCallback !== null && volumeInterval === null) volumeInterval = setInterval(volumeCallback, 250);
    setIsStart(true);
  };
  const stop = () => {
    if (volumeInterval !== null) {
      clearInterval(volumeInterval);
      volumeInterval = null;
      setIsStart(false);
    }
  };

  const closeModal = () => {
    setError("");
  };

  const createDecibelHistory = async (username, password, arr) => {
    const userToFetch = { username, password, arr, testName };
    const response = await axios.put(`${herokuUrl}user2`, userToFetch);

    return response.data;
  };

  const selectedUser = async (createdUser) => {
    const response = await axios.post(`${herokuUrl}user2`, createdUser);
    if (response.data) setUser(response.data);
    return response.data;
  };
  const fetchTestName = async (timeLapse) => {
    const createdTest = { username: user.username, testName, timeLapse };

    const response = await axios.put(`${herokuUrl}user`, createdTest);

    setUser(response.data);
  };
  const addUser = async (user) => {
    const response = await axios.post(`${herokuUrl}user`, user);
    return response.data;
  };

  const value = {
    addUser,
    testName,
    checkAndCompareDecibelByTime,
    setTestName,
    fetchTestName,
    isStart,
    frequencyArr,
    closeModal,
    error,
    start,
    stop,
    createAudioPermissionAndRecord,
    decibel,
    lastMin,
    user,
    selectedUser,
    setUser,
    createDecibelHistory,
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
export default DataProvider;
