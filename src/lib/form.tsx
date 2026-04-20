import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
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

const { fieldContext, formContext, useFieldContext } = createFormHookContexts();

function TextField({
  label,
  type = "text",
  placeholder,
}: Readonly<{
  label: string;
  type?: string;
  placeholder?: string;
}>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.errors.length > 0;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{label}</FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        aria-invalid={isInvalid}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={e => field.handleChange(e.target.value)}
      />
      {isInvalid && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </Field>
  );
}

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField },
  formComponents: {},
});
