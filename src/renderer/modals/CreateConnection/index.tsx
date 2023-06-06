import { z } from "zod";
import { findIndex } from "lodash";
import { v4 as randomUUID } from "uuid";
import React, { useEffect } from "react";
import { enqueueSnackbar } from "notistack";

import ModalBase from "renderer/modals/Base";
import Select from "renderer/ui/Select";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import { useZodForm } from "renderer/hooks/zod";
import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { connectionsSlice } from "renderer/store/reducers/connections/slice";

import { ConnectionI } from "renderer/types/connection";

import style from "./index.module.scss";

interface IProps {
  data?: ConnectionI,
  isVisible: boolean;
  onClose(): void
}

const schema = z.object({

  label: z.string()
    .nonempty("Введите название"),

  groupId: z.string()
    .nonempty("Выберите группу"),

  host: z.string()
    .nonempty("Введите хост"),

  port: z.number(),

  login: z.string()
    .nonempty("Введите имя пользователя"),

  password: z.string()
    .nonempty("Введите пароль")
});

export default function CreateConnection(props: IProps) {

  const { isVisible, onClose } = props;

  const { groups } = useAppSelector((state) => state.groupsReducer);
  const { connections } = useAppSelector((state) => state.connectionsReducer);

  const isUpdate = !!props.data;

  const {
    setFormData,
    formData,
    validateForm,
    clearForm,
    onInputChange,
    onSelectChange,
    onInputBlur
  } = useZodForm(schema, {
    label: "",
    groupId: "",
    host: "",
    port: 22,
    login: "",
    password: ""
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!props.data) {
      clearForm();
      return;
    }

    setFormData({
      ...props.data
    });
  }, [props.data]);

  const createConnection = () => {
    const validate = validateForm();

    if (!validate.isValid) {
      const errors = validate.errors!;

      (Object.keys(errors) as Array<keyof typeof errors>).map((key) => {

        if (!errors[key]) {
          return;
        }

        enqueueSnackbar({
          message: errors[key],
          variant: "error"
        });

      });

      return;
    }

    if (isUpdate) {
      const index = findIndex(connections, { id: props.data?.id });

      dispatch(connectionsSlice.actions.edit({
        index,
        data: {
          ...props.data!,
          ...formData
        }
      }));
    } else {
      dispatch(connectionsSlice.actions.add({
        id: randomUUID(),
        ...formData
      }));

      clearForm();
    }

    onClose();
  };

  const removeConnection = () => {
    const index = findIndex(connections, { id: props.data?.id });

    dispatch(connectionsSlice.actions.remove(index));

    onClose();
  };

  return (
    <ModalBase
      className={style.createGroup}
      title={`${isUpdate ? "Изменение" : "Создание"} соединения`}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div className={style.createGroup__grid}>
        <Input
          caption="Название"
          name="label"
          value={formData.label}
          placeholder="Pixefy"
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
        <Select
          caption="Группа"
          name="groupId"
          value={formData.groupId}
          onChange={onSelectChange}
        >
          <option value="" disabled>Выберите группу</option>
          {groups.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </Select>
      </div>
      <div className={style.createGroup__title}>SHH</div>
      <div className={style.createGroup__grid}>
        <Input
          caption="Хост"
          name="host"
          value={formData.host}
          placeholder="127.0.0.1"
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
        <Input
          caption="Порт"
          name="port"
          value={formData.port}
          placeholder="25565"
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
        <Input
          caption="Пользователь"
          name="login"
          value={formData.login}
          placeholder="root"
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
        <Input
          caption="Пароль"
          type="password"
          name="password"
          value={formData.password}
          placeholder="..."
          onChange={onInputChange}
          onBlur={onInputBlur}
        />
      </div>
      <div className={style.createGroup__action}>
        {isUpdate && (
          <Button appearance="destructive" onClick={removeConnection}>Удалить</Button>
        )}
        <Button onClick={createConnection}>{isUpdate ? "Изменить" : "Создать"}</Button>
      </div>
    </ModalBase>
  );
}
