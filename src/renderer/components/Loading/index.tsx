import { classNames } from "renderer/utils/classNames";

import LoadingIcon from "@icons/spinner.svg";

import style from "./index.module.scss";

export default function Loading({ hidden }: { hidden: boolean }) {
  return (
    <div className={classNames(style.loading, hidden && style.loadingHidden)}>
      <div className={style.loadingInner}>
        <img src={LoadingIcon} alt="" />
      </div>
    </div>
  );
}
