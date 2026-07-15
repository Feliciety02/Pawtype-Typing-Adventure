import * as React from "react";

import { cn } from "@/lib/utils/utils";

type NativeSelectProps = React.ComponentPropsWithoutRef<"select">;

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn("pixel-select", className)} {...props}>
      {children}
    </select>
  ),
);
NativeSelect.displayName = "NativeSelect";

type CheckboxFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "type"> & {
  label: React.ReactNode;
  wrapperClassName?: string;
};

const CheckboxField = React.forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ className, id, label, wrapperClassName, ...props }, ref) => {
    const generatedId = React.useId();
    const controlId = id ?? generatedId;

    return (
      <label className={cn("pixel-checkbox-field", wrapperClassName)} htmlFor={controlId}>
        <input
          ref={ref}
          id={controlId}
          type="checkbox"
          className={cn("pixel-checkbox", className)}
          {...props}
        />
        <span>{label}</span>
      </label>
    );
  },
);
CheckboxField.displayName = "CheckboxField";

export { CheckboxField, NativeSelect };
