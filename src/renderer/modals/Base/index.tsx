import React, { useEffect } from "react";
import { DivProps } from "react-html-props";

import { classNames } from "renderer/utils/classNames";

import IconClose from "/assets/icons/close.svg";

import style from "./index.module.scss";

export interface ModalProps extends DivProps {

  title: string;

  isVisible: boolean;
  buttons?: JSX.Element;

  onClose(): void

}

export default function ModalBase(props: ModalProps) {

  const {
    title,
    isVisible,
    children,
    buttons,
    onClose
  } = props;

  useEffect(() => {

    const closeListener = (event: KeyboardEvent) => {

      const { code } = event;

      if (code === "Escape") {
        onClose();
        event.stopPropagation();
      }

    };

    document.addEventListener("keydown", closeListener);

    return () => {
      document.removeEventListener("keydown", closeListener);
    };
  }, []);

  return (
    <div className={classNames(
      style.wrapper,
      !isVisible && style.wrapperHidden
    )}
    >
      <div
        className={classNames(
          style.baseModal,
          !isVisible && style.baseModalHidden,
          props.className
        )}
      >

        <div className={style.header}>

          <h2 className={style.header__title}>
            {title}
          </h2>

          <div className={style.closeActions}>

            <div className={style.closeActions__iconWrapper}>
              <img
                className={style.closeActions__icon}
                src={IconClose}
                alt=""
                onClick={onClose}
              />
            </div>

          </div>

        </div>

        <div className={style.content}>
          {children}
        </div>

        <div className={style.footer}>
          {buttons}
        </div>

      </div>
    </div>
  );
}
