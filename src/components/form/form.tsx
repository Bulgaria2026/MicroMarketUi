import { TextField } from "@/components/form/text-field";
import { fieldContext, formContext } from "@/components/form/form-contexts";
import { createFormHook } from "@tanstack/react-form";
import type { z } from "zod";

export function blurFirst<T>(schema: z.ZodType<T>) {
  const validate = (value: T): string | undefined => {
    const result = schema.safeParse(value);
    return result.success ? undefined : result.error.issues[0]?.message;
  };
  return {
    onSubmit: ({ value }: { value: T }) => validate(value),
    onChange: ({ value, fieldApi }: { value: T; fieldApi: { state: { meta: { isBlurred: boolean } } } }) =>
      fieldApi.state.meta.isBlurred ? validate(value) : undefined,
  };
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
});
