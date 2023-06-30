import "../styles/globals.css";
import DataProvider from "../context/Data";
import { Provider } from "react-redux";
import store from "../store/reduxStore";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </Provider>
  );
}

export default MyApp;
