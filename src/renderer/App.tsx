import { useEffect } from "react";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import Sidebar from "renderer/components/Sidebar";

import MainPage from "renderer/pages/Main";
import SshPage from "renderer/pages/Ssh";
import ConsolePage from "renderer/pages/Console";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { useFirstRender } from "renderer/hooks/useFirstRender";

import { groupsSlice } from "renderer/store/reducers/groups/slice";

import "./App.scss";

export default function App() {

  const { groups } = useAppSelector((state) => state.groupsReducer);

  const firstRender = useFirstRender();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (firstRender) {
      const groupsString = localStorage.getItem("groups");

      if (!groupsString) {
        return;
      }

      dispatch(groupsSlice.actions.set(JSON.parse(groupsString) || []));

      return;
    }

    localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={(<Sidebar><MainPage /></Sidebar>)} />
        <Route path="/ssh" element={(<Sidebar><SshPage /></Sidebar>)} />
        <Route path="/console" element={(<Sidebar><ConsolePage /></Sidebar>)} />
      </Routes>
    </Router>
  );
}
