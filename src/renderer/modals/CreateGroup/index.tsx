import React, { useState } from "react";
import { useModalClose } from "renderer/hooks/modals";

import ModalBase from "renderer/modals/Base";

import style from "./index.module.scss";

interface IProps {
  isVisible: boolean;
  onClose(): void
}

export default function CreateGroup(props: IProps) {

  const { isVisible, onClose } = props;

  const close = useModalClose(() => {}, onClose);

  return (
    <ModalBase
      className={style.createEnvironment}
      title="Создание группы"
      isVisible={isVisible}
      buttons={(
        <>
          {/*<Button*/}
          {/*  kind="primary"*/}
          {/*  isLoading={isLoading}*/}
          {/*  disabled={isLoading}*/}
          {/*  onClick={onSubmit}*/}
          {/*>*/}
          {/*  Save*/}
          {/*</Button>*/}
          {/*<Button*/}
          {/*  kind="secondary"*/}
          {/*  disabled={isLoading}*/}
          {/*  onClick={close}*/}
          {/*>*/}
          {/*  Close*/}
          {/*</Button>*/}
        </>
      )}
      onClose={close}
    >
      1
    </ModalBase>
  );
}
