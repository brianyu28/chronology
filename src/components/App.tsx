import * as React from "react";
import { connect } from "react-redux";

import { AppState, ConfigState } from "../reducers/types";
import UploadConfig from "./UploadConfig";
import TimeTracker from "./TimeTracker";

import "../css/App.css";

interface AppProps {
  config: ConfigState;
}

class App extends React.Component<AppProps> {
  public render() {
    return (
      <div className="app">
        {this.renderAppContent()}
      </div>
    );
  }

  private renderAppContent() {
    const { config } = this.props;
    if (config === undefined) {
      return <UploadConfig />;
    } else {
      return <TimeTracker />;
    }
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    config: state.config
  };
}

export default connect(mapStateToProps, null)(App as any);
