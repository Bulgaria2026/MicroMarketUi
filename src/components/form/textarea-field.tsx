import { useFieldContext } from "@/components/form/form-contexts";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaField({
  label,
  placeholder,
  rows,
}: Readonly<{
  label: string;
  placeholder?: string;
  rows?: number;
}>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.errors.length > 0;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel>{label}</FieldLabel>
      <Textarea
        placeholder={placeholder}
        rows={rows}
        aria-invalid={isInvalid}
        value={field.state.value}
        onBlur={() => { field.handleBlur(); field.validate("change"); }}
        onChange={e => field.handleChange(e.target.value)}
      />
      {isInvalid && <FieldError>{field.state.meta.errors[0]}</FieldError>}
    </Field>
  );
}
