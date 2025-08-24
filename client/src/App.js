import React from "react";
import FeatureForm from "./components/FeatureForm";
import cucumberLogo from "./cucumber.png";

function App() {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <img
          src={cucumberLogo}
          alt="Cucumber Logo"
          style={{ height: 80, display: "block", margin: "0 auto" }}
        />
      </div>
      <FeatureForm />
    </div>
  );
}

export default App;
