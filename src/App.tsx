import React, { FC } from "react";
import VideoCall from "./components/VideoCall";
import { ErrorBoundary } from "react-error-boundary";
import { Alert } from "antd";
import "./App.css";

function ErrorFallback() {
  return (
    <Alert
      showIcon={false}
      message="Something went wrong!"
      banner
      type="error"
    />
  );
}

const App: FC = () => {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <VideoCall />
      </ErrorBoundary>
    </>
  );
};

export default App;
