import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";

import RenderFolder from "renderer/components/Sftp/Render/Folder";
import RenderFile from "renderer/components/Sftp/Render/File";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { appSlice } from "renderer/store/reducers/app/slice";

import HostItemIcon from "@icons/host_item.svg";

import { GroupI } from "renderer/types/groups";
import { ConnectionI } from "renderer/types/connection";

import style from "./index.module.scss";
import { useAsyncEffect } from "renderer/hooks/useAsyncEffect";

interface IProps {
  update: number,
  localPath: string | undefined,
  onMove(): void,
  onPathChange(path: string): void
}

interface ElementItem {
  name: string,
  isDirectory: boolean
}

export default function RemoteSftp({ update, localPath, onMove, onPathChange }: IProps) {

  const { groups } = useAppSelector((state) => state.groupsReducer);
  const { connections } = useAppSelector((state) => state.connectionsReducer);

  const dispatch = useAppDispatch();

  const [path, setPath] = useState<string>();
  const [connected, setConnected] = useState<boolean>(false);

  const [elements, setElements] = useState<Array<ElementItem>>();

  useEffect(() => {
    onPathChange(path!);
  }, [path]);

  useAsyncEffect(async () => {
    if (!path) {
      return;
    }

    await getElements(path);
  }, [update]);

  const getElements = async (path: string) => {
    dispatch(appSlice.actions.setLoading(true));

    try {
      let elements: Array<ElementItem> = (await window.electron.app.sftpList(path)).map((item) => ({
        name: item.name,
        isDirectory: item.type === "d"
      }));

      elements.sort((a, b) => +b.isDirectory - +a.isDirectory);

      setElements(elements);
    } catch (e) {
      console.log(e);

      enqueueSnackbar({
        message: "Недостаточно прав",
        variant: "error"
      });
    }

    dispatch(appSlice.actions.setLoading(false));
  };

  const goBack = async () => {
    const splitPath = path?.split("/");

    if (!splitPath) {
      return;
    }

    splitPath.length -= 2;

    const prevPath = splitPath.join("/") + "/";

    await getElements(prevPath);

    setPath(prevPath);
  };

  const goPath = async (folder: string) => {
    const directory = (path ? (path + folder) : folder) + "/";

    await getElements(directory);

    setPath(directory);
  };

  const getConnections = (group: GroupI) => {
    return connections.filter((item) => item.groupId === group.id);
  };

  const connectSSH = async (connection: ConnectionI) => {
    const { host, port, login, password } = connection;

    dispatch(appSlice.actions.setLoading(true));

    try {
      await window.electron.app.connectSFTP(host, port, login, password);
      await getElements("/");

      setPath("/");
      setConnected(true);
    } catch (e) {
      console.log(e);

      enqueueSnackbar({
        message: "Произошла ошибка при подключении",
        variant: "error"
      });
    }

    dispatch(appSlice.actions.setLoading(false));
  };

  const move = async (name: string) => {
    dispatch(appSlice.actions.setLoading(true));

    try {
      await window.electron.app.sftpTransferGet(path + name, localPath + name);

      onMove();
    } catch (e) {
      console.log(e);
    }
  };

  if (connected) {
    return (
      <div className={style.elements}>
        {path !== "/" && (
          <RenderFolder
            name=".."
            onDoubleClick={goBack}
          />
        )}
        {elements?.map(({ name, isDirectory }) => isDirectory ? (
          <RenderFolder
            key={name}
            name={name}
            onDoubleClick={() => goPath(name)}
            onMoveClick={() => move(name)}
          />
        ) : (
          <RenderFile
            key={name}
            name={name}
            onMoveClick={() => move(name)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={style.groups}>
      {groups.length !== 0 && (
        groups.map((group, index) => (
          <div className={style.groups__item} key={group.name + index}>
            <div className={style.groups__header}>
              <div className={style.groups__caption}>{group.name}</div>
            </div>
            <div className={style.groups__list}>
              {getConnections(group).length !== 0 ? (
                getConnections(group).map((connection) => (
                  <div
                    className={style.group__item}
                    key={group.name + connection.label}
                    onClick={() => connectSSH(connection)}
                  >
                    <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                    <div className={style.groupItem__info}>
                      <div className={style.groupItem__name}>{connection.label}</div>
                      <div className={style.groupItem__description}>shh, {connection.login}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div>Добавьте соединение</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
