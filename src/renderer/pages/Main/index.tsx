import React, { useState } from "react";
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
import { GroupI } from "renderer/types/groups";
import Login from "renderer/modals/Auth/Login";
import Register from "renderer/modals/Auth/Register";

export default function MainPage() {

  const { history } = useAppSelector((state) => state.connectionReducer);
  const { groups } = useAppSelector((state) => state.groupsReducer);
  const { connections } = useAppSelector((state) => state.connectionsReducer);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [editGroupData, setEditGroupData] = useState<GroupI>();
  const [createGroupVisible, setCreateGroupVisible] = useState(false);

  const [editConnectionData, setEditConnectionData] = useState<ConnectionI>();
  const [createConnectionVisible, setCreateConnectionVisible] = useState(false);

  const connectSSH = async (connection: ConnectionI) => {
    await Promise.all([
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

  const editGroup = async (e: React.MouseEvent<HTMLDivElement>, group: GroupI) => {
    e.stopPropagation();

    await setEditGroupData(group);
    setCreateGroupVisible(true);
  };

  const getConnections = (group: GroupI) => {
    return connections.filter((item) => item.groupId === group.id);
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
              onClick={async () => {
                await setEditConnectionData(undefined);
                setCreateConnectionVisible(true);
              }}
            >
              <img src={HostIcon} alt="" />
              <span>Соединение</span>
            </button>
          )}
          <button
            className={style.actions__item}
            onClick={async () => {
              await setEditGroupData(undefined);
              setCreateGroupVisible(true);
            }}
          >
            <img src={GroupIcon} alt="" />
            <span>Группа</span>
          </button>
        </div>
        <div className={style.groups}>
          {groups.length !== 0 ? (
            groups.map((group, index) => (
              <div className={style.groups__item} key={group.name + index}>
                <div className={style.groups__header}>
                  <div className={style.groups__caption}>{group.name}</div>
                  <div className={style.groups__actions}>
                    <div
                      className={style.groups__action}
                      onClick={(e) => editGroup(e, group)}
                    >
                      <img src={EditIcon} alt="" />
                    </div>
                  </div>
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
                  onClick={async () => {
                    await setEditGroupData(undefined);
                    setCreateGroupVisible(true);
                  }}
                >
                  Создать
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateGroup
        data={editGroupData}
        isVisible={createGroupVisible}
        onClose={() => setCreateGroupVisible(false)}
      />

      <CreateConnection
        data={editConnectionData}
        isVisible={createConnectionVisible}
        onClose={() => setCreateConnectionVisible(false)}
      />

      <Login />
      <Register />

    </>
  );
}
