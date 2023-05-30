import { ReactNode } from "react";

import HostsIcon from "@icons/hosts.svg";
import SftpIcon from "@icons/sftp.svg";
import HistoryIcon from "@icons/history.svg";

import style from "./index.module.scss";

export default function Sidebar({ children }: {
  children: ReactNode
}) {
  return (
    <div className={style.layout}>
      <div className={style.sidebar}>
        <div className={style.sidebar__logo}>
          Terix
        </div>
        <div className={style.sidebar__menu}>
          <div className={style.menu__item}>
            <img src={HostsIcon} alt="" />
            <span>Hosts</span>
          </div>
          <div className={style.menu__item}>
            <img src={SftpIcon} alt="" />
            <span>SFTP</span>
          </div>
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
