import React, { useState } from "react";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";

import { connectionSlice } from "renderer/store/reducers/connection/slice";

import style from "./index.module.scss";

export default function ConsolePage() {

  const { activeConnection, history } = useAppSelector((state) => state.connectionReducer);

  const [command, setCommand] = useState("");

  const dispatch = useAppDispatch();

  useAsyncEffect(async () => {
    if (activeConnection === undefined) {
      return;
    }

    if (history[activeConnection].messages) {
      return;
    }

    const data = await window.electron.app.sshExecute("run-parts /etc/update-motd.d/");
    dispatch(connectionSlice.actions.addMessage({ index: activeConnection, data }))
  }, []);

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
      <div className={style.consoleMessage}>
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
