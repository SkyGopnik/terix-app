import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HostIcon from "@icons/host.svg";
import GroupIcon from "@icons/group.svg";
import HostItemIcon from "@icons/host_item.svg";
import EditIcon from "@icons/edit.svg";

import CreatehostPlaceholder from "@images/createhost_placeholder.png";

import CreateGroup from "renderer/modals/CreateGroup";
import CreateConnection from "renderer/modals/CreateConnection";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";

import style from "./index.module.scss";
import { ConnectionI } from "renderer/types/connection";
import { connectionSlice } from "renderer/store/reducers/connection/slice";

export default function MainPage() {

  const { history } = useAppSelector((state) => state.connectionReducer);
  const { groups } = useAppSelector((state) => state.groupsReducer);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  const [editConnectionData, setEditConnectionData] = useState<ConnectionI>();
  const [createConnectionVisible, setCreateConnectionVisible] = useState(false);

  const connectSSH = async (connection: ConnectionI) => {
    const { host, port, login, password } = connection;

    await Promise.all([
      window.electron.app.connectSSH(host, port, login, password),
      dispatch(connectionSlice.actions.addConnection({
        ...connection,
        messages: "",
        commands: []
      })),
      dispatch(connectionSlice.actions.changeActiveConnection(history.length))
    ]);

    await navigate("/console");
  };

  const editConnection = async (e: React.MouseEvent<HTMLDivElement>, connection: ConnectionI) => {
    e.stopPropagation();

    await setEditConnectionData(connection);
    setCreateConnectionVisible(true);
  };

  return (
    <>
      <div className={style.page}>
        <input
          className={style.search}
          type="text"
          placeholder="Поиск"
        />
        <div className={style.actions}>
          {groups.length !== 0 && (
            <button
              className={style.actions__item}
              onClick={() => setCreateConnectionVisible(true)}
            >
              <img src={HostIcon} alt="" />
              <span>Соединение</span>
            </button>
          )}
          <button
            className={style.actions__item}
            onClick={() => setCreateGroupVisible(true)}
          >
            <img src={GroupIcon} alt="" />
            <span>Группа</span>
          </button>
        </div>
        <div className={style.groups}>
          {groups.length !== 0 ? (
            groups.map((group, index) => (
              <div className={style.groups__item} key={group.name + index}>
                <div className={style.groups__caption}>{group.name}</div>
                <div className={style.groups__list}>
                  {group.connections ? (
                    group.connections.map((connection) => (
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
                        <div
                          className={style.groupItem__action}
                          onClick={(e) => editConnection(e, connection)}
                        >
                          <img src={EditIcon} alt="" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>Добавьте соединение</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={style.placeholder}>
              <div className={style.placeholder__modal}>
                <h2 className={style.placeholder__title}>Добавьте свое первое соединение</h2>
                <img className={style.placeholder__image} src={CreatehostPlaceholder} alt="" />
                <button
                  className={style.placeholder__button}
                  onClick={() => setCreateGroupVisible(true)}
                >
                  Создать
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <CreateGroup
        isVisible={createGroupVisible}
        onClose={() => setCreateGroupVisible(false)}
      />
      <CreateConnection
        data={editConnectionData}
        isVisible={createConnectionVisible}
        onClose={async () => {
          await setCreateConnectionVisible(false);
          setEditConnectionData(undefined);
        }}
      />
    </>
  );
}
