import { z } from "zod";
import React, { useState } from "react";
import { useModalClose } from "renderer/hooks/modals";

import ModalBase from "renderer/modals/Base";
import Select from "renderer/ui/Select";
import Button from "renderer/ui/Button";
import Input from "renderer/ui/Input";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";

import style from "./index.module.scss";
import { useZodForm } from "renderer/hooks/zod";
import { enqueueSnackbar } from "notistack";
import { groupsSlice } from "renderer/store/reducers/groups/slice";
import { findIndex } from "lodash";

interface IProps {
  isVisible: boolean;
  onClose(): void
}

const schema = z.object({

  label: z.string()
    .nonempty("Введите название"),

  group: z.string()
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

  const {
    formData,
    validateForm,
    clearForm,
    onInputChange,
    onSelectChange,
    onInputBlur
  } = useZodForm(schema, {
    label: "",
    group: "",
    host: "",
    port: 22,
    login: "",
    password: ""
  });

  const dispatch = useAppDispatch();

  const close = useModalClose(clearForm, onClose);

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

    const groupIndex = findIndex(groups, { name: formData.group });

    dispatch(groupsSlice.actions.addConnection({
      groupIndex: groupIndex!,
      data: formData
    }));

    close();
  };

  return (
    <ModalBase
      className={style.createGroup}
      title="Создание соединения"
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
          name="group"
          value={formData.group}
          onChange={onSelectChange}
        >
          <option value="" disabled>Выберите группу</option>
          {groups.map((item) => (
            <option key={item.name} value={item.name}>{item.name}</option>
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
        <Button onClick={createConnection}>Создать</Button>
      </div>
    </ModalBase>
  );
}
