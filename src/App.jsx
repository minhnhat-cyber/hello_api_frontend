import { HashRouter, Route, Routes } from "react-router-dom";
import TestApi from "./TestApi";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/test_api" element={<TestApi />} />
      </Routes>
    </HashRouter>
  );
}

export default App;