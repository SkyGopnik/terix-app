import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import Sidebar from "renderer/components/Sidebar";

import MainPage from "renderer/pages/Main";
import SshPage from "renderer/pages/Ssh";

import "./App.scss";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={(<Sidebar><MainPage /></Sidebar>)} />
        <Route path="/ssh" element={(<Sidebar><SshPage /></Sidebar>)} />
      </Routes>
    </Router>
  );
}
