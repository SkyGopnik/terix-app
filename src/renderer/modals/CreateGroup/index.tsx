import React, { useState } from "react";

import { useModalClose } from "renderer/hooks/modals";

import ModalBase from "renderer/modals/Base";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import style from "./index.module.scss";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "renderer/hooks/redux";
import { groupsSlice } from "renderer/store/reducers/groups/slice";

interface IProps {
  isVisible: boolean;
  onClose(): void
}

export default function CreateGroup(props: IProps) {

  const { isVisible, onClose } = props;

  const dispatch = useAppDispatch();

  const [name, setName] = useState("");

  const close = useModalClose(() => setName(""), onClose);

  const createGroup = () => {
    if (name.length === 0) {
      enqueueSnackbar({
        message: "Название обязательно для заполнения",
        variant: "error"
      });

      return;
    }

    dispatch(groupsSlice.actions.add({
      name
    }));

    close();
  };

  return (
    <ModalBase
      className={style.createGroup}
      title="Создание группы"
      isVisible={isVisible}
      onClose={close}
    >
      <Input
        name="name"
        caption="Название"
        value={name}
        placeholder="Главный сервер"
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <div className={style.createGroup__action}>
        <Button onClick={createGroup}>Создать</Button>
      </div>
    </ModalBase>
  );
}
