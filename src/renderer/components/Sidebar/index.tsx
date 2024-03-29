import React, { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { connectionSlice } from "renderer/store/reducers/connection/slice";
import { classNames } from "renderer/utils/classNames";

import HostsIcon from "@icons/hosts.svg";
import SftpIcon from "@icons/sftp.svg";
import HistoryIcon from "@icons/history.svg";
import ActiveHostIcon from "@icons/active_host.svg";
import RemoveIcon from "@icons/close.svg";

import style from "./index.module.scss";
import Button from "renderer/ui/Button";
import { authSlice } from "renderer/store/reducers/auth/slice";

export default function Sidebar({ children }: {
  children: ReactNode
}) {
  const { history, activeConnection } = useAppSelector((state) => state.connectionReducer);
  const { user } = useAppSelector((state) => state.userReducer);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const connectSSH = async (index: number) => {
    await dispatch(connectionSlice.actions.changeActiveConnection(index));

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
              onClick={() => connectSSH(index)}
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
            to="/sftp"
          >
            <img src={SftpIcon} alt="" />
            <span>SFTP</span>
          </Link>
          {/*<div className={style.menu__item}>*/}
          {/*  <img src={HistoryIcon} alt="" />*/}
          {/*  <span>History</span>*/}
          {/*</div>*/}
        </div>
        <div className={style.sidebar__actions}>
          <Button
            className={style.action__button}
            onClick={() => {
              dispatch(authSlice.actions.setVisible(true));
              dispatch(authSlice.actions.setPage("login"));
            }}
          >
            Войти
          </Button>
        </div>
      </div>
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
}
