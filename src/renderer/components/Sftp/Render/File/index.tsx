import FileIcon from "@icons/file.svg";

import style from "./index.module.scss";
import MoveIcon from "@icons/move.svg";

interface IProps {
  name: string,
  onMoveClick?(): void
}

export default function RenderFile({ name, onMoveClick }: IProps) {
  return (
    <div className={style.item}>
      <img className={style.item__icon} src={FileIcon} alt="" />
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
