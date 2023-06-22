import React from "react";
import { z } from "zod";

import Input from "renderer/ui/Input";
import Button from "renderer/ui/Button";

import { classNames } from "renderer/utils/classNames";
import { useZodForm, ZodFormData } from "renderer/hooks/zod";
import { enqueueSnackbar } from "notistack";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { AuthPage } from "renderer/types/auth";
import { authSlice } from "renderer/store/reducers/auth/slice";

import style from "./index.module.scss";

const schema = z.object({
  email: z.string().nonempty("Введите Email").email("Невалидный Email"),
  password: z.string().nonempty("Введите пароль")
});

interface IProps {
  page: AuthPage,
  actionName: string,
  isVisible: boolean,
  onSubmit: (formData: ZodFormData<typeof schema>) => void
}

export default function AuthBase(props: IProps) {

  const dispatch = useAppDispatch();

  const { page, actionName, isVisible } = props;

  const { formData, validateForm, setFormData, onInputChange } = useZodForm(schema, {
    email: "",
    password: ""
  });

  const onSubmit = () => {

    const validationResult = validateForm();
    if (!validationResult.isValid) {

      const errors = validationResult.errors!;

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

    setFormData({
      email: "",
      password: ""
    });

    props.onSubmit(formData);

  };

  const changePage = (page: AuthPage) => {
    dispatch(authSlice.actions.setPage(page));
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={style.loginWrapper}>
      <div className={style.login}>

        <div className={style.header}>

          <div
            className={classNames(
              style.item,
              page === "login" && style.itemActive
            )}
            onClick={() => changePage("login")}
          >
            <p className={style.item__label}>Авторизация</p>
          </div>

          <div
            className={classNames(
              style.item,
              page === "register" && style.itemActive
            )}
            onClick={() => changePage("register")}
          >
            <p className={style.item__label}>Регистрация</p>
          </div>

        </div>

        <div className={style.content}>

          <Input
            name="email"
            caption="Email"
            placeholder="Email"
            value={formData["email"]}
            onChange={onInputChange}
          />

          <Input
            name="password"
            caption="Пароль"
            type="password"
            placeholder="Пароль"
            value={formData["password"]}
            onChange={onInputChange}
          />

          <Button
            className={style.content__button}
            onClick={onSubmit}
          >
            {actionName}
          </Button>

        </div>

      </div>
    </div>
  );
}
