import * as React from "react";
import { connect } from "react-redux";
import { FileInput } from "@blueprintjs/core";
import { Dispatch, ConfigState } from "../reducers/types";
import { setConfig } from "../actions/actions";

import "../css/UploadConfig.css";

interface UploadConfigProps {
  setConfig: (config: ConfigState) => null;
}

class UploadConfig extends React.Component<UploadConfigProps> {
  public render() {
    return (
      <div className="upload-config">
        <h2>Chronology</h2>
        <FileInput text="Upload configuration..." onInputChange={this.handleUpload} />
      </div>
    );
  }

  private handleUpload = (event: React.FormEvent<HTMLInputElement>) => {
    const file = (event.target as any).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const config = JSON.parse(reader.result as string);
      this.props.setConfig(config);
    }
    reader.readAsText(file);
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setConfig: (config: ConfigState) => dispatch(setConfig(config))
  };
}

export default connect(null, mapDispatchToProps)(UploadConfig as any);