import FolderIcon from "@icons/folder.svg";

import { DivProps } from "react-html-props";

import style from "./index.module.scss";

interface IProps extends DivProps {
  name: string
}

export default function RenderFolder({ name, ...props }: IProps) {
  return (
    <div
      className={style.item}
      {...props}
    >
      <img className={style.item__icon} src={FolderIcon} alt="" />
      <span className={style.item__text}>{name}</span>
    </div>
  );
}
