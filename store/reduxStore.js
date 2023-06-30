import { configureStore, createSlice } from "@reduxjs/toolkit";
const decibelSliceInitialState = {
  currentDecibelNum: 0,
  maxDecibelNum: 0,
  minDecibelNum: 999,
  decibelNumHistoryArr: [],
  dbGraph: [],
};
const userSliceInitialState = { username: "", password: "", current: [], decibelHistory: [] };

const userSlice = createSlice({
  name: "user",
  initialState: userSliceInitialState,
  reducers: {
    signIn(state, action) {
      state.username = action.payload.username;
      state.password = action.payload.password;
      state.current = action.payload.current ? action.payload.current : [];
      state.decibelHistory = action.payload.decibelHistory;
    },
    addDecibelArr(state, action) {
      state.decibelHistory = [...state.decibelHistory, action.payload];
    },
    addCurrentArr(state, action) {
      state.current = action.payload;
    },
  },
});

const decibelSlice = createSlice({
  name: "decibel",
  initialState: decibelSliceInitialState,
  reducers: {
    getDecibel(state, action) {
      state.currentDecibelNum = action.payload;
      state.maxDecibelNum = Math.max(state.maxDecibelNum, action.payload);
      state.minDecibelNum = Math.min(state.minDecibelNum, action.payload);
      state.decibelNumHistoryArr = [...state.decibelNumHistoryArr, action.payload];
    },
  },
});
const frequencySlice = createSlice({
  name: "frequency",
  initialState: { frequency: [] },
  reducers: {
    getFrequency(state, action) {
      state.frequency = action.payload;
    },
  },
});
const testNameSlice = createSlice({
  name: "testname",
  initialState: { testName: "" },
  reducers: {
    getTestName(state, action) {
      state.testName = action.payload;
    },
  },
});
const modalErrorSlice = createSlice({
  name: "modalerrorslice",
  initialState: { error: "" },
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
  },
});
const reduxStore = configureStore({
  reducer: {
    decibel: decibelSlice.reducer,
    frequency: frequencySlice.reducer,
    testName: testNameSlice.reducer,
    modalError: modalErrorSlice.reducer,
    user: userSlice.reducer,
  },
});
export const decibelAction = decibelSlice.actions;
export const frequencyAction = frequencySlice.actions;
export const testNameAction = testNameSlice.actions;
export const modalErrorAction = modalErrorSlice.actions;
export const userAction = userSlice.actions;
export default reduxStore;
