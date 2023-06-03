import HostIcon from "@icons/host.svg";
import GroupIcon from "@icons/group.svg";
import HostItemIcon from "@icons/host_item.svg";

import CreatehostPlaceholder from "@images/createhost_placeholder.png";

import style from "./index.module.scss";
import { useState } from "react";
import CreateGroup from "renderer/modals/CreateGroup";
import CreateConnection from "renderer/modals/CreateConnection";

export default function MainPage() {

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
            onClick={() => setCreateConnectionVisible(true)}
          >
            <img src={HostIcon} alt="" />
            <span>Соединение</span>
          </button>
          <button
            className={style.actions__item}
            onClick={() => setCreateGroupVisible(true)}
          >
            <img src={GroupIcon} alt="" />
            <span>Группа</span>
          </button>
        </div>
        <div className={style.groups}>
          <div className={style.groups__item}>
            <div className={style.groups__caption}>Pixefy</div>
            <div className={style.groups__list}>
              <div className={style.group__item}>
                <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                <div className={style.groupItem__info}>
                  <div className={style.groupItem__name}>Main</div>
                  <div className={style.groupItem__description}>shh, root</div>
                </div>
              </div>
              <div className={style.group__item}>
                <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                <div className={style.groupItem__info}>
                  <div className={style.groupItem__name}>Main</div>
                  <div className={style.groupItem__description}>shh, root</div>
                </div>
              </div>
            </div>
          </div>
          <div className={style.groups__item}>
            <div className={style.groups__caption}>Pixefy</div>
            <div className={style.groups__list}>
              <div className={style.group__item}>
                <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                <div className={style.groupItem__info}>
                  <div className={style.groupItem__name}>Main</div>
                  <div className={style.groupItem__description}>shh, root</div>
                </div>
              </div>
              <div className={style.group__item}>
                <img className={style.groupItem__icon} src={HostItemIcon} alt="" />
                <div className={style.groupItem__info}>
                  <div className={style.groupItem__name}>Main</div>
                  <div className={style.groupItem__description}>shh, root</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className={style.placeholder}>*/}
        {/*  <div className={style.placeholder__modal}>*/}
        {/*    <h2 className={style.placeholder__title}>Добавьте свое первое соединение</h2>*/}
        {/*    <img className={style.placeholder__image} src={CreatehostPlaceholder} alt="" />*/}
        {/*    <button className={style.placeholder__button}>Создать</button>*/}
        {/*  </div>*/}
        {/*</div>*/}
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
