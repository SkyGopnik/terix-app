import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HostsIcon from "@icons/hosts.svg";
import SftpIcon from "@icons/sftp.svg";
import HistoryIcon from "@icons/history.svg";
import ActiveHostIcon from "@icons/active_host.svg";
import RemoveIcon from "@icons/close.svg";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { connectionSlice } from "renderer/store/reducers/connection/slice";

import { ConnectionI } from "renderer/types/connection";

import style from "./index.module.scss";
import { classNames } from "renderer/utils/classNames";

export default function Sidebar({ children }: {
  children: ReactNode
}) {
  const { history, activeConnection } = useAppSelector((state) => state.connectionReducer);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const connectSSH = async (index: number, connection: ConnectionI) => {
    const { host, port, login, password } = connection;

    await Promise.all([
      window.electron.app.connectSSH(host, port, login, password),
      dispatch(connectionSlice.actions.changeActiveConnection(index))
    ]);

    await navigate("/console");
  };

  const onRemoveHistoryClick = async (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    e.stopPropagation();

    await navigate("/");

    dispatch(connectionSlice.actions.removeConnection(index));
  };

  const checkActive = (url: string) => {
    if (url === "/" && pathname === "/") {
      return true;
    }

    return url !== "/" && pathname?.includes(url);
  };

  return (
    <div className={style.layout}>
      <div className={style.sidebar}>
        <div className={style.sidebar__logo}>
          Terix
        </div>
        <div className={style.sidebar__menu}>
          <Link
            className={classNames(
              style.menu__item,
              checkActive("/") && style.menu__itemActve
            )}
            to="/"
          >
            <img src={HostsIcon} alt="" />
            <span>Hosts</span>
          </Link>
          {history.map((item, index) => (
            <div
              className={classNames(
                style.menu__item,
                (checkActive("/console") && index === activeConnection) && style.menu__itemActve
              )}
              key={item.label + index}
              onClick={() => connectSSH(index, item)}
            >
              <img src={ActiveHostIcon} alt="" />
              <span>{item.label} <span className={style.menuItem__small}>{item.login}</span></span>
              <img
                className={style.menuItem__remove}
                src={RemoveIcon} alt=""
                onClick={(e) => onRemoveHistoryClick(e, index)}
              />
            </div>
          ))}
          <Link
            className={classNames(
              style.menu__item,
              checkActive("/ssh") && style.menu__itemActve
            )}
            to="/ssh"
          >
            <img src={SftpIcon} alt="" />
            <span>SFTP</span>
          </Link>
          <div className={style.menu__item}>
            <img src={HistoryIcon} alt="" />
            <span>History</span>
          </div>
        </div>
      </div>
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
}
