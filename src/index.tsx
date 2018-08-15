import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage"
import { createStore } from "redux";

import reducer from "./reducers/reducers";
import { defaultState } from "./reducers/types";

import App from "./components/App";
import "./css/index.css";
import registerServiceWorker from "./registerServiceWorker";

const persistConfig = { key: "root", storage };
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer, defaultState);
const persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
