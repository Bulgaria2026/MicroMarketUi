import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFieldContext } from "@/components/form/form-contexts";

export function TextField({
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
