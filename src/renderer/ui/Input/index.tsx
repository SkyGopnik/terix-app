import { InputProps } from "react-html-props";

import style from "./index.module.scss";

interface IProps extends InputProps {
  caption: string
}

export default function Input(props: IProps) {
  return (
    <label className={style.input}>
      <span className={style.input__caption}>{props.caption}</span>
      <input {...props} className={style.input__field} />
    </label>
  );
}
