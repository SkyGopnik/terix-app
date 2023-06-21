import FolderIcon from "@icons/folder.svg";
import MoveIcon from "@icons/move.svg";

import { DivProps } from "react-html-props";

import style from "./index.module.scss";

interface IProps extends DivProps {
  name: string,
  onMoveClick?(): void
}

export default function RenderFolder({ name, onMoveClick, ...props }: IProps) {
  return (
    <div
      className={style.item}
      {...props}
    >
      <img className={style.item__icon} src={FolderIcon} alt="" />
      <span className={style.item__text}>{name}</span>
      {onMoveClick && (
        <img
          className={style.item__move}
          src={MoveIcon}
          alt=""
          onClick={(e) => {
            e.stopPropagation();
            onMoveClick();
          }}
        />
      )}
    </div>
  );
}
