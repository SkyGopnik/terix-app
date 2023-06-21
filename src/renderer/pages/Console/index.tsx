import { enqueueSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";

import { connectionSlice } from "renderer/store/reducers/connection/slice";

import style from "./index.module.scss";

export default function ConsolePage() {

  const { activeConnection, history } = useAppSelector((state) => state.connectionReducer);

  const [command, setCommand] = useState("");
  const consoleRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    if (activeConnection === undefined) {
      return;
    }

    if (history[activeConnection].messages) {
      return;
    }

    const { host, port, login, password } = history[activeConnection];

    try {
      await window.electron.app.connectSSH(host, port, login, password);

      const data = await window.electron.app.sshExecute("run-parts /etc/update-motd.d/");
      dispatch(connectionSlice.actions.addMessage({ index: activeConnection, data }))
    } catch (e) {
      console.log(e);

      enqueueSnackbar({
        message: "Произошла ошибка при подключении",
        variant: "error"
      });
    }
  }, []);

  useEffect(() => {
    if (!consoleRef?.current) {
      return;
    }

    consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
  }, [history[activeConnection!]]);

  const onKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    const data = await window.electron.app.sshExecute(command);
    dispatch(connectionSlice.actions.addMessage({ index: activeConnection!, data }));

    setCommand("");
  };

  if (activeConnection === undefined) {
    return null;
  }

  const connection = history[activeConnection];

  return (
    <div className={style.console}>
      <div className={style.consoleMessage} ref={consoleRef}>
        {connection.messages}
      </div>
      <label className={style.consoleWritebar}>
        <span className={style.writebar__placeholder}>{connection.login}<span>~</span>$</span>
        <input
          className={style.writebar__input}
          value={command}
          type="text"
          onChange={(e) => setCommand(e.currentTarget.value)}
          onKeyDown={onKeyDown}
        />
      </label>
    </div>
  );
}
