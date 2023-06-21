import { findIndex } from "lodash";
import { v4 as randomUUID } from "uuid";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

import ModalBase from "renderer/modals/Base";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { groupsSlice } from "renderer/store/reducers/groups/slice";

import { GroupI } from "renderer/types/groups";

import style from "./index.module.scss";

interface IProps {
  data?: GroupI,
  isVisible: boolean;
  onClose(): void
}

export default function CreateGroup(props: IProps) {

  const { isVisible, onClose } = props;

  const { groups } = useAppSelector((state) => state.groupsReducer);

  const dispatch = useAppDispatch();

  const [name, setName] = useState("");

  const isUpdate = !!props.data;

  useEffect(() => {
    if (!props.data) {
      setName("");
      return;
    }

    setName(props.data.name);
  }, [props.data]);

  const createGroup = () => {
    if (name.length === 0) {
      enqueueSnackbar({
        message: "Название обязательно для заполнения",
        variant: "error"
      });

      return;
    }

    if (isUpdate) {
      const index = findIndex(groups, { id: props.data?.id });

      dispatch(groupsSlice.actions.edit({
        index,
        data: {
          ...props.data!,
          name
        }
      }));
    } else {
      const groupIndex = findIndex(groups, { name });

      if (groupIndex !== -1) {
        enqueueSnackbar({
          message: "Группа уже существует",
          variant: "error"
        });

        return;
      }

      dispatch(groupsSlice.actions.add({
        id: randomUUID(),
        name
      }));
    }

    onClose();
  };

  const removeGroup = () => {
    const index = findIndex(groups, { id: props.data?.id });

    dispatch(groupsSlice.actions.remove(index));

    onClose();
  };

  return (
    <ModalBase
      className={style.createGroup}
      title={`${isUpdate ? "Изменение" : "Создание"} группы`}
      isVisible={isVisible}
      onClose={onClose}
    >
      <Input
        name="name"
        caption="Название"
        value={name}
        placeholder="Главный сервер"
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <div className={style.createGroup__action}>
        {isUpdate && (
          <Button appearance="destructive" onClick={removeGroup}>Удалить</Button>
        )}
        <Button onClick={createGroup}>{isUpdate ? "Изменить" : "Создать"}</Button>
      </div>
    </ModalBase>
  );
}
