import React, { useState } from "react";
import { useModalClose } from "renderer/hooks/modals";

import ModalBase from "renderer/modals/Base";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import style from "./index.module.scss";

interface IProps {
  isVisible: boolean;
  onClose(): void
}

export default function CreateGroup(props: IProps) {

  const { isVisible, onClose } = props;

  const close = useModalClose(() => {}, onClose);

  return (
    <ModalBase
      className={style.createGroup}
      title="Создание группы"
      isVisible={isVisible}
      onClose={close}
    >
      <Input caption="Название" placeholder="Главный сервер" />
      <div className={style.createGroup__action}>
        <Button>Создать</Button>
      </div>
    </ModalBase>
  );
}
