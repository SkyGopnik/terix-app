import { ReactNode } from "react";

import HostsIcon from "@icons/hosts.svg";
import SftpIcon from "@icons/sftp.svg";
import HistoryIcon from "@icons/history.svg";

import style from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar({ children }: {
  children: ReactNode
}) {
  const navigate = useNavigate();

  return (
    <div className={style.layout}>
      <div className={style.sidebar}>
        <div className={style.sidebar__logo}>
          Terix
        </div>
        <div className={style.sidebar__menu}>
          <Link className={style.menu__item} to="/">
            <img src={HostsIcon} alt="" />
            <span>Hosts</span>
          </Link>
          <Link className={style.menu__item} to="/ssh">
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
