import React, { ChangeEvent, useState } from "react";

import { z } from "zod";
import axios from "axios";
import { v4 as randomUUID } from "uuid";

import { useZodForm } from "renderer/hooks/zod";
import { useAppSelector } from "renderer/hooks/redux";

import { IEnvironment, IEnvironmentVariable } from "renderer/types/environment";
import { useTimer } from "renderer/utils/timer";

import ModalBase from "renderer/modals/Base";

import Input from "renderer/ui/Input";
import Button from "renderer/ui/Button";
import Tooltip from "renderer/ui/Tooltip";
import BasicInput from "renderer/ui/BasicInput";

import IconDelete from "@icons/delete.svg";

import style from "./index.module.scss";
import { useModalClose } from "renderer/hooks/modals";

const schema = z.object({
  name: z.string().nonempty("Enter environment name")
});

interface IProps {

  isVisible: boolean;

  onCreated(environment: IEnvironment): void
  onClose(): void

}

interface IVariable {
  id: string;
  name: string;
  value: string;
}

const createEmptyVariable = (): IEnvironmentVariable => ({
  id: randomUUID(),
  name: "",
  value: ""
});

export default function CreateEnvironment(props: IProps) {

  const { isVisible, onClose, onCreated } = props;
  const { currentWorkspaceId } = useAppSelector(state => state.workspacesReducer);

  const {
    formData,
    formErrors,
    clearForm,
    validateForm,
    onInputChange,
    onInputBlur
  } = useZodForm(schema, {
    name: ""
  });

  const [variables, setVariables] = useState<IVariable[]>([createEmptyVariable()]);
  const [isLoading, setLoading] = useState(false);

  const cleanUp = () => {
    clearForm();
    setVariables([createEmptyVariable()]);
    setLoading(false);
  };

  const close = useModalClose(cleanUp, onClose);

  const onVariableInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {

    const { target } = event;
    const { name, value } = target;

    const newVariables = [...variables];
    newVariables[index] = {
      ...variables[index],
      [name]: value
    };

    const isEmpty = (variable: IVariable) => {
      return variable && variable.name === "" && variable.value === "";
    };

    const filteredVariables = newVariables
      .filter(it => !isEmpty(it));

    const last = filteredVariables[filteredVariables.length - 1];
    const secondLast = filteredVariables[filteredVariables.length - 2];

    if (!isEmpty(last)) {
      filteredVariables.push(createEmptyVariable());
    }

    if (isEmpty(last) && filteredVariables.length > 1 && isEmpty(secondLast)) {
      filteredVariables.pop();
    }

    setVariables(filteredVariables);

  };

  const onVariableDelete = (index: number) => {

    const newVariables = [...variables];
    newVariables.splice(index, 1);

    setVariables(newVariables);

  };

  const onSubmit = async () => {

    if (isLoading) {
      return;
    }

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const timer = useTimer();
    setLoading(true);

    try {

      const { data } = await axios.post(`workspaces/${currentWorkspaceId}/environments/new`, {
        ...formData,
        variables: variables.filter(it => it.name !== "")
      });

      timer.runWhenElapsed(() => {

        setLoading(false);

        close();
        onCreated(data);

        clearForm();

      });

    } catch (ex) {

      // TODO
      timer.runWhenElapsed(() => {
        setLoading(false);
      });

    }

  };

  return (
    <ModalBase
      className={style.createEnvironment}
      title="Create environment"
      isVisible={isVisible}
      buttons={(
        <>

          <Button
            kind="primary"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={onSubmit}
          >
            Save
          </Button>

          <Button
            kind="secondary"
            disabled={isLoading}
            onClick={close}
          >
            Close
          </Button>

        </>
      )}
      onClose={close}
    >

      <Input
        name="name"
        placeholder="Name"
        disabled={isLoading}
        value={formData.name}
        error={formErrors.name}
        onChange={onInputChange}
        onBlur={onInputBlur}
      />

      <p className={style.label}>
        Variables
      </p>

      <div className={style.variables}>
        {variables.map((variable, index) => (
          <div
            className={style.variables__row}
            key={variable.id}
          >

            <BasicInput
              className={style.name}
              name="name"
              placeholder={`Variable ${index + 1}`}
              disabled={isLoading}
              onChange={(event) => onVariableInputChange(index, event)}
            />

            <BasicInput
              className={style.value}
              name="value"
              placeholder={`Value ${index + 1}`}
              disabled={isLoading}
              onChange={(event) => onVariableInputChange(index, event)}
            />

            <Tooltip
              content="Delete"
            >
              <button
                className={style.delete}
                disabled={index === variables.length - 1 || isLoading}
                onClick={() => onVariableDelete(index)}
              >
                <img className={style.delete__icon} src={IconDelete} alt="" />
              </button>
            </Tooltip>

          </div>
        ))}
      </div>

    </ModalBase>
  );
}
