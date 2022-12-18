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
    current: [], // current state spectrum
    daily: [],
    avg: 0,
    alarm: false,
    max: 0,
    min: 999,
  });

  // sec=4 min=240 hour=14400 day=345600
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("key"));
    if (data) {
      setUser(data);
    }
  }, []);

  const loop = user.timeLapse;

  const currentSpec = Math.floor((10 * loop) / 100);
  const localUrl = "http://localhost:3000/api/";
  const herokuUrl = "https://decibel-meter.herokuapp.com/api/";
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

  const checkAndCompareDecibelByTime = () => {
    const currentDate = new Date().toJSON().substring(0, 16);
    //while generating default
    if (Object.keys(user).length == 0) return;
    const currentDecibelDate = user.decibelHistory.find((dbDate) => {
      return dbDate.date == currentDate;
    });
    if (decibel.decibelNumHistoryArr.length == loop) {
      decibel.decibelNumHistoryArr = [];
    }
    if (user.decibelHistory.length * 240 < loop && decibel.decibelNumHistoryArr.length > 0) {
      if (
        decibel.currentDecibelNum > Number(lastMin.avg + dbDiff) ||
        decibel.currentDecibelNum < Number(lastMin.avg - dbDiff)
      ) {
        lastMin.alarm = true;
      }
    }

    // when default is generated
    if (user.decibelHistory.length * 240 == loop && decibel.decibelNumHistoryArr.length > 0 && currentDecibelDate) {
      if (lastMin.avg > currentDecibelDate.avg || lastMin.avg < currentDecibelDate.avg) {
        setError("current state is not the same as default");
      }
      //check if any hard changes made during the current state\\
      if (
        decibel.currentDecibelNum > Number(lastMin.avg + dbDiff) ||
        decibel.currentDecibelNum < Number(lastMin.avg - dbDiff)
      ) {
        //if yes, check if an alarm is familiar
        if (!currentDecibelDate.alarm) {
          //if not, compare current db with avg specific time in user database
          if (
            decibel.currentDecibelNum > currentDecibelDate.avg + dbDiff ||
            decibel.currentDecibelNum > currentDecibelDate.max
          ) {
            setError(`${currentDecibelDate.date} High volume detected:${decibel.currentDecibelNum} `);
          }
          if (
            decibel.currentDecibelNum < currentDecibelDate.avg - dbDiff ||
            decibel.currentDecibelNum < currentDecibelDate.min
          ) {
            setError(`${currentDecibelDate.date} Low volume detected:${decibel.currentDecibelNum} `);
          }
        }
      }
    }
  };
  // Initialize

  const createAudioPermissionAndRecord = async () => {
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

        if (decibel.dbGraph.length > 100) {
          decibel.dbGraph.shift(decibel.dbGraph[0]);
        } //for design

        // GENERATE CURRENT STATE AVG \\
        //      keep current on 1 minute
        if (lastMin.current.length > 240) {
          lastMin.current.shift(lastMin.current[0]);
        }
        let xSum = 0;
        let xMin = 999,
          xMax = 0;

        for (let j = 0; j < lastMin.current.length; j++) {
          xSum += Number(lastMin.current[j]);
          if (user.decibelHistory.length * 4 <= loop) {
            // for first run ONLY
            xMin = Math.min(xMin, Number(lastMin.current[j]));
            xMax = Math.max(xMax, Number(lastMin.current[j]));
          }
        }

        let xAvg = Number(xSum / lastMin.current.length);
        lastMin.avg = Math.floor(xAvg);
        if (user.decibelHistory.length * 4 <= loop) {
          // for first run ONLY
          lastMin.min = Math.floor(xMin);
          lastMin.max = Math.floor(xMax);
        }

        // GENERATING DAILY ARRAY \\
        if (
          decibel.decibelNumHistoryArr.length % 240 == 0 && //every minute
          decibel.decibelNumHistoryArr.length <= loop &&
          user.decibelHistory.length * 240 <= loop
        ) {
          //for first run ONLY
          lastMin.daily.push({
            time: getTime(),
            avg: lastMin.avg,
            max: lastMin.max,
            min: lastMin.min,
            alarm: lastMin.alarm,
          });

          lastMin.alarm = false;
        }

        //Send to Data-Base\\ -- for first run ONLY!!!
        if (decibel.decibelNumHistoryArr.length % currentSpec == 0 && user.decibelHistory.length * 240 < loop) {
          //every quarter of loop
          decibelHistoryBtn();
          // console.log("added to Data-Base", lastMin.daily);
          lastMin.daily = []; //re-generate daily
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
    const userFromDb = await createDecibelHistory(user.name, user.password, lastMin.daily);
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
  const chooseSelectedArr = (e) => {
    user.currentTest = user.decibelHistory.filter((value) => {
      return value.date === e.target.innerHTML;
    });
  };
  const createDecibelHistory = async (name, password, arr) => {
    const userToFetch = { name, password, arr };
    const response = await axios.put(`${herokuUrl}user2`, userToFetch);

    return response.data;
  };
  const selectedUser = async (createdUser) => {
    const response = await axios.post(`${herokuUrl}user2`, createdUser);

    return response.data;
  };
  const fetchTestName = async (test) => {
    const testName = { name: user.name, testName: test };
    const response = await axios.post(`${herokuUrl}user3`, testName);
    setUser(response.data);
  };

  const testing = async (e) => {
    e.preventDefault();
    await axios.put(`${herokuUrl}user3`, "hello");
  };

  const allUsers = async () => {
    const users = await axios.get(`${herokuUrl}user4`);
    return JSON.stringify(users.data);
  };
  const value = {
    allUsers,
    checkAndCompareDecibelByTime,
    testing,
    localUrl,
    herokuUrl,
    fetchTestName,
    chooseSelectedArr,
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
