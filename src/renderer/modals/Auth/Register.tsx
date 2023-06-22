import React from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

import AuthBase from "renderer/modals/Auth/Base";

import { useAppDispatch, useAppSelector } from "renderer/hooks/redux";
import { userSlice } from "renderer/store/reducers/user/slice";
import { authSlice } from "renderer/store/reducers/auth/slice";

export default function Login() {

  const { isVisible, page } = useAppSelector(state => state.authReducer);

  const dispatch = useAppDispatch();

  const onSubmit = async (formData: { email: string, password: string }) => {
    try {
      const { data } = await axios.post("/auth/register", {
        ...formData
      });

      localStorage.setItem("token", data.token);

      dispatch(userSlice.actions.setUser(data));
      dispatch(authSlice.actions.setVisible(false));

      enqueueSnackbar({
        message: "Успешная регистрация",
        variant: "success"
      });
    } catch (e) {
      console.log(e);

      enqueueSnackbar({
        message: "Произошла ошибка при регистрации",
        variant: "error"
      });
    }
  };

  return (
    <AuthBase
      page="register"
      onSubmit={onSubmit}
      isVisible={isVisible && page === "register"}
      actionName="Зарегистрироваться"
    />
  );
}
