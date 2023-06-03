import { ButtonProps } from "react-html-props";

import style from "./index.module.scss";

interface IProps extends ButtonProps {}

export default function Button(props: IProps) {

  return (
    <button {...props} className={style.button} />
  );

}
