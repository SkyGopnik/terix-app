import { useEffect } from "react";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import Sidebar from "renderer/components/Sidebar";

import MainPage from "renderer/pages/Main";
import SftpPage from "renderer/pages/Sftp";
import ConsolePage from "renderer/pages/Console";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { useFirstRender } from "renderer/hooks/useFirstRender";

import { groupsSlice } from "renderer/store/reducers/groups/slice";
import { connectionsSlice } from "renderer/store/reducers/connections/slice";

import "./App.scss";

export default function App() {

  const { groups } = useAppSelector((state) => state.groupsReducer);
  const { connections } = useAppSelector((state) => state.connectionsReducer);

  const firstRender = useFirstRender();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (firstRender) {
      const stateString = localStorage.getItem("state");

      if (!stateString) {
        return;
      }

      const { groups, connections } = JSON.parse(stateString) || {};

      dispatch(groupsSlice.actions.set(groups));
      dispatch(connectionsSlice.actions.set(connections));

      return;
    }

    localStorage.setItem("state", JSON.stringify({
      groups,
      connections
    }));
  }, [groups, connections]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={(<Sidebar><MainPage /></Sidebar>)} />
        <Route path="/sftp" element={(<Sidebar><SftpPage /></Sidebar>)} />
        <Route path="/console" element={(<Sidebar><ConsolePage /></Sidebar>)} />
      </Routes>
    </Router>
  );
}
