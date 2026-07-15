import { Moon, Sun } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useThemeMode } from "@/hooks/use-theme-mode";

type ThemeToggleProps = Omit<ButtonProps, "children" | "variant"> & {
  compact?: boolean;
};

export function ThemeToggle({
  className,
  compact = false,
  type = "button",
  ...props
}: ThemeToggleProps) {
  const { dark, toggleThemeMode } = useThemeMode();

  return (
    <Button
      type={type}
      variant="secondary"
      onClick={toggleThemeMode}
      className={className}
      aria-label={dark ? "Switch to day mode" : "Switch to night mode"}
      title={dark ? "Switch to day mode" : "Switch to night mode"}
      {...props}
    >
      {dark ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
      <span>{compact ? (dark ? "Night" : "Day") : dark ? "Night Mode" : "Day Mode"}</span>
    </Button>
  );
}
