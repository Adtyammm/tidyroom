import React from "react";
import { BrowserRouter } from "react-router-dom";
import Rout from "./routes/Rout";

const App = () => {
  return (
    <BrowserRouter>
      <Rout />
    </BrowserRouter>
  );
};

export default App;
