import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Item from "./Item";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="item" replace />} />
          <Route path="item" element={<Item />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
