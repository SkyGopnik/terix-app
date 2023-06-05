import { SelectProps } from "react-html-props";

import style from "./index.module.scss";

interface IProps extends SelectProps {
  caption: string
}

export default function Select(props: IProps) {
  return (
    <label className={style.select}>
      <span className={style.select__caption}>{props.caption}</span>
      <select {...props} className={style.select__field} />
    </label>
  );
}
