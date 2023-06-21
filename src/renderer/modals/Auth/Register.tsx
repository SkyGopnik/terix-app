import React from "react";
import AuthBase from "renderer/modals/Auth/Base";
import { useAppSelector } from "renderer/hooks/redux";

export default function Login() {

  const { isVisible, page } = useAppSelector(state => state.authReducer);

  const onSubmit = (formData: any) => {
    // TODO: logic
  };

  return (
    <AuthBase
      page="register"
      onSubmit={onSubmit}
      isVisible={isVisible && page === "register"}
      actionName="Sign up"
    />
  );
}
