import { TextField } from "@/components/form/text-field";
import { fieldContext, formContext } from "@/components/form/form-contexts";
import { createFormHook } from "@tanstack/react-form";
import type { z } from "zod";

export function afterSubmit<T>(schema: z.ZodType<T>) {
  const validate = (value: T): string | undefined => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.issues[0]?.message;
  };
  return {
    onSubmit: ({ value }: { value: T }) => validate(value),
    onChange: ({ value, fieldApi }: { value: T; fieldApi: { form: { state: { submissionAttempts: number } } } }) =>
      fieldApi.form.state.submissionAttempts > 0 ? validate(value) : undefined,
  };
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
});
