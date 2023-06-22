import React, { useEffect } from "react";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";

import Sidebar from "renderer/components/Sidebar";
import Loading from "renderer/components/Loading";

import MainPage from "renderer/pages/Main";
import SftpPage from "renderer/pages/Sftp";
import ConsolePage from "renderer/pages/Console";

import Login from "renderer/modals/Auth/Login";
import Register from "renderer/modals/Auth/Register";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { useFirstRender } from "renderer/hooks/useFirstRender";

import { groupsSlice } from "renderer/store/reducers/groups/slice";
import { connectionsSlice } from "renderer/store/reducers/connections/slice";

import "./App.scss";
import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";
import axios from "axios";
import { userSlice } from "renderer/store/reducers/user/slice";

export default function App() {

  const { loading } = useAppSelector((state) => state.appReducer);
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

  useAsyncEffect(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    axios.defaults.headers["authorization"] = token;

    try {
      const { data } = await axios.get("/user/profile");

      dispatch(userSlice.actions.setUser(data));
    } catch (e) {
      console.log(e);

      localStorage.removeItem("token");
      delete axios.defaults.headers["authorization"];
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={(<Sidebar><MainPage /></Sidebar>)} />
          <Route path="/sftp" element={(<Sidebar><SftpPage /></Sidebar>)} />
          <Route path="/console" element={(<Sidebar><ConsolePage /></Sidebar>)} />
        </Routes>
      </Router>

      <Login />
      <Register />

      <Loading hidden={!loading} />
    </>
  );
}
