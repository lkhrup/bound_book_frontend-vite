import {DeepMap, FieldError, FieldValues, get, Path, UseFormRegister} from "react-hook-form";
import classNames from "classnames";

interface FormFieldProps<TFormValues extends FieldValues> {
  register: UseFormRegister<TFormValues>;
  label: string;
  name: Path<TFormValues>;
  type: string;
  required?: boolean;
  errors?: Partial<DeepMap<TFormValues, FieldError>>;
}

export function FormField<TFormValues extends FieldValues>({ name, register, label, type, required, errors }: FormFieldProps<TFormValues>) {
  const errorMessages = get(errors, name);
  const hasError = Boolean(errors && errorMessages);
  return (
    <div className="mb-4">
      <label
        className={classNames(
          "block text-sm font-bold mb-2",
          hasError ? "text-red-500" : "text-gray-700"
        )}
        htmlFor={name}
      >
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name, { required })}
        type={type}
        placeholder={label}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  );
}

FormField.defaultProps = {
  required: false,
};