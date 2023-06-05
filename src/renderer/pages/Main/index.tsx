import HostIcon from "@icons/host.svg";
import GroupIcon from "@icons/group.svg";
import HostItemIcon from "@icons/host_item.svg";

import CreatehostPlaceholder from "@images/createhost_placeholder.png";

import style from "./index.module.scss";
import { useState } from "react";
import CreateGroup from "renderer/modals/CreateGroup";
import CreateConnection from "renderer/modals/CreateConnection";
import { useAppSelector } from "renderer/hooks/redux";

export default function MainPage() {

  const { groups } = useAppSelector((state) => state.groupsReducer);

  const [createGroupVisible, setCreateGroupVisible] = useState(false);
  const [createConnectionVisible, setCreateConnectionVisible] = useState(false);

  return (
    <>
      <div className={style.page}>
        <input
          className={style.search}
          type="text"
          placeholder="Поиск"
        />
        <div className={style.actions}>
          <button
            className={style.actions__item}
            onClick={() => setCreateGroupVisible(true)}
          >
            <img src={GroupIcon} alt="" />
            <span>Группа</span>
          </button>
          {groups.length !== 0 && (
            <button
              className={style.actions__item}
              onClick={() => setCreateConnectionVisible(true)}
            >
              <img src={HostIcon} alt="" />
              <span>Соединение</span>
            </button>
          )}
        </div>
        <div className={style.groups}>
          {groups.length !== 0 ? (
            groups.map((item, index) => (
              <div className={style.groups__item} key={item.name + index}>
                <div className={style.groups__caption}>{item.name}</div>
                <div className={style.groups__list}>
                  {item.connections ? (
                    item.connections.map((connection) => (
                      <div className={style.group__item}>
                        <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                        <div className={style.groupItem__info}>
                          <div className={style.groupItem__name}>{connection.label}</div>
                          <div className={style.groupItem__description}>shh, {connection.login}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>test</div>
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
        isVisible={createConnectionVisible}
        onClose={() => setCreateConnectionVisible(false)}
      />
    </>
  );
}
