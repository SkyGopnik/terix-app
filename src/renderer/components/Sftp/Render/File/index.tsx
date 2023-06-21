import FileIcon from "@icons/file.svg";

import style from "./index.module.scss";

export default function RenderFile({ name }: { name: string }) {
  return (
    <div className={style.item}>
      <img className={style.item__icon} src={FileIcon} alt="" />
      <span className={style.item__text}>{name}</span>
    </div>
  );
}
