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
    formErrors,
    validateForm,
    onInputChange,
    onSelectChange
  } = useZodForm(schema, {
    label: "",
    group: groups[0]?.name || "",
    host: "",
    port: 22,
    login: "",
    password: ""
  });

  const dispatch = useAppDispatch();

  const close = useModalClose(() => {}, onClose);

  const createConnection = () => {
    const isValid = validateForm();

    if (!isValid) {
      (Object.keys(formErrors) as Array<keyof typeof formErrors>).map((key) => {

        if (!formErrors[key]) {
          return;
        }

        enqueueSnackbar({
          message: formErrors[key],
          variant: "error"
        });

      });

      return;
    }
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
        />
        <Select
          caption="Группа"
          name="group"
          value={formData.group}
          placeholder="Главный сервер"
          onChange={onSelectChange}
        >
          {groups.map((item) => (
            <option>{item.name}</option>
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
        />
        <Input
          caption="Порт"
          name="port"
          value={formData.port}
          placeholder="25565"
          onChange={onInputChange}
        />
        <Input
          caption="Пользователь"
          name="login"
          value={formData.login}
          placeholder="root"
          onChange={onInputChange}
        />
        <Input
          caption="Пароль"
          type="password"
          name="password"
          value={formData.password}
          placeholder="..."
          onChange={onInputChange}
        />
      </div>
      <div className={style.createGroup__action}>
        <Button onClick={createConnection}>Создать</Button>
      </div>
    </ModalBase>
  );
}
