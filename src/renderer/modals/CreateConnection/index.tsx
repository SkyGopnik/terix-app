import { z } from "zod";
import { find, findIndex } from "lodash";
import { v4 as randomUUID } from "uuid";
import React, { useEffect } from "react";
import { enqueueSnackbar } from "notistack";

import { useModalClose } from "renderer/hooks/modals";
import ModalBase from "renderer/modals/Base";
import Select from "renderer/ui/Select";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import { useZodForm } from "renderer/hooks/zod";
import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { groupsSlice } from "renderer/store/reducers/groups/slice";

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

    const groupIndex = findIndex(groups, { id: formData.groupId });

    if (isUpdate) {
      const connectionIndex = findIndex(groups[groupIndex].connections, { id: props.data?.id });

      dispatch(groupsSlice.actions.editConnection({
        groupIndex,
        connectionIndex,
        data: {
          ...props.data!,
          ...formData
        }
      }));
    } else {
      dispatch(groupsSlice.actions.addConnection({
        groupIndex: groupIndex!,
        data: {
          id: randomUUID(),
          ...formData
        }
      }));

      clearForm();
    }

    onClose();
  };

  const removeConnection = () => {
    const groupIndex = findIndex(groups, { id: formData.groupId });

    dispatch(groupsSlice.actions.removeConnection({ groupIndex, id: props.data!.id }));

    onClose();
  };

  return (
    <ModalBase
      className={style.createGroup}
      title={`${isUpdate ? "Изменение" : "Создание"} соединения`}
      isVisible={isVisible}
      onClose={close}
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
        <Button onClick={createConnection}>{isUpdate ? "Изменить" : "Создать"}</Button>
        {isUpdate && (
          <Button appearance="destructive" onClick={removeConnection}>Удалить</Button>
        )}
      </div>
    </ModalBase>
  );
}
