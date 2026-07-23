import { forwardRef, type ComponentPropsWithoutRef } from "react";

type CampBackButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children">;

export const CampBackButton = forwardRef<HTMLButtonElement, CampBackButtonProps>(
  function CampBackButton({ className = "", type = "button", ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={`camp-back-button ${className}`.trim()}
        aria-label="Back to Camp"
        {...props}
      >
        <img src="/shared/buttons/camp-back-button.webp" alt="" aria-hidden="true" />
      </button>
    );
  },
);
