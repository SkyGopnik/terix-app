import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import MainPage from "renderer/pages/Main";

import "./App.scss";
import Sidebar from "renderer/components/Sidebar";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={(<Sidebar><MainPage /></Sidebar>)} />
      </Routes>
    </Router>
  );
}
