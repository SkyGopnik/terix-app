import { ButtonProps } from "react-html-props";

import { classNames } from "renderer/utils/classNames";

import style from "./index.module.scss";

interface IProps extends ButtonProps {
  appearance?: 'destructive'
}

export default function Button(props: IProps) {

  return (
    <button {...props} className={classNames(style.button, style[`buttonAppearance_${props.appearance}`], props.className)} />
  );

}
