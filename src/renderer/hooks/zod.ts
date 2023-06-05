import React, { ChangeEvent, useState } from "react";

import { z, ZodType } from "zod";

import mapValues from "lodash/mapValues";
import pick from "lodash/pick";
import omit from "lodash/omit";

export type ZodFormData<TSchema extends ZodType> = z.infer<TSchema>;

export type ZodFormErrors<TSchema extends ZodType> = {
  [key in keyof z.infer<TSchema>]?: string;
};

export function useZodForm<TSchema extends ZodType>(
  schema: TSchema,
  initialState: ZodFormData<TSchema>
) {

  const [formData, setFormData] = useState(initialState);
  const [formErrors, setFormErrors] = useState<ZodFormErrors<TSchema>>({});

  const setValue = (key: keyof typeof formData, value: any) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const clearForm = () => {
    setFormData(initialState);
    setFormErrors({});
  };

  const validateForm = useZodValidation(
    schema, formData, formErrors, setFormErrors
  );

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {

    const { target } = event;
    const { name, value } = target;

    setFormData({
      ...formData,
      [name]: value
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setFormErrors({
      ...omit(formErrors, name)
    });

  };

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {

    const { target } = event;
    const { name, value } = target;

    setFormData({
      ...formData,
      [name]: value
    });

  }

  const onInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    validateForm(event.target.name);
  };

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    setValue,
    clearForm,
    validateForm,
    onInputChange,
    onSelectChange,
    onInputBlur
  };
}

export function useZodValidation<TSchema extends ZodType>(
  schema: TSchema,
  formData: ZodFormData<TSchema>,
  formErrors: ZodFormErrors<TSchema>,
  setFormErrors: (errors: ZodFormErrors<TSchema>) => void
) {
  return (...fieldNames: string[]): {
    isValid: boolean,
    errors?: ZodFormErrors<TSchema>
  } => {

    const result = schema.safeParse(formData);
    if (result.success) {
      return {
        isValid: true
      };
    }

    const zodErrors = result.error.flatten().fieldErrors;
    const mappedErrors = mapValues(zodErrors, (it) => it?.at(0));

    const anyField = fieldNames.length === 0;

    if (anyField) {
      setFormErrors(mappedErrors);
    } else {
      setFormErrors({
        ...formErrors,
        ...pick(mappedErrors, fieldNames)
      });
    }

    return {
      isValid: false,
      errors: mappedErrors
    };
  };
}
