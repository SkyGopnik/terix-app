import React, { useEffect } from "react";
import { DivProps } from "react-html-props";

import { classNames } from "renderer/utils/classNames";

import CloseIcon from "@icons/close.svg";

import style from "./index.module.scss";

export interface ModalProps extends DivProps {

  title: string;

  isVisible: boolean;

  onClose(): void

}

export default function ModalBase(props: ModalProps) {

  const {
    title,
    isVisible,
    children,
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

  const test = async () => {
    await window.electron.app.connectSSH();

      console.log(await window.electron.app.sshExecute('ls'));
  };

  return (
    <div
      className={classNames(
        style.wrapper,
        !isVisible && style.wrapperHidden
      )}
      onClick={test}
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
            <img
              className={style.closeActions__icon}
              src={CloseIcon}
              alt=""
              onClick={onClose}
            />
          </div>

        </div>

        <div className={style.content}>
          {children}
        </div>

      </div>
    </div>
  );
}
