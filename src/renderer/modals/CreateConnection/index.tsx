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

export default function CreateConnection(props: IProps) {

  const { isVisible, onClose } = props;

  const close = useModalClose(() => {}, onClose);

  return (
    <ModalBase
      className={style.createGroup}
      title="Создание соединения"
      isVisible={isVisible}
      onClose={close}
    >
      <div className={style.createGroup__grid}>
        <Input caption="Название" placeholder="Pixefy" />
        <Input caption="Группа" placeholder="Главный сервер" />
        <Input caption="Хостер" placeholder="firstvds" />
        <Input caption="Описание" placeholder="..." />
      </div>
      <div className={style.createGroup__title}>SHH</div>
      <div className={style.createGroup__grid}>
        <Input caption="IP" placeholder="127.0.0.1" />
        <Input caption="Порт" placeholder="25565" />
        <Input caption="Пользователь" placeholder="root" />
        <Input caption="Пароль" placeholder="..." />
      </div>
      <div className={style.createGroup__action}>
        <Button>Создать</Button>
      </div>
    </ModalBase>
  );
}
