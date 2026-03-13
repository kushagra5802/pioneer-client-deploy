import React from "react";
import AppContextProvider from "./context/AppContextProvider";
import RouteApps from "./routes/RouteApps";


function App() {

  return (
      <AppContextProvider>
        <RouteApps />
      </AppContextProvider>
  );
}

export default App;
