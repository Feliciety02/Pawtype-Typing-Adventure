import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/lib/utils/utils";

export type PixelChoice<T extends string> = {
  id: T;
  label: string;
  icon?: ReactNode;
};

type PixelChoiceBarProps<T extends string> = {
  items: PixelChoice<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  idPrefix: string;
  kind?: "tabs" | "filters";
  variant?: "segmented" | "compact";
  panelId?: string;
  className?: string;
};

export function PixelChoiceBar<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  idPrefix,
  kind = "tabs",
  variant = "compact",
  panelId,
  className,
}: PixelChoiceBarProps<T>) {
  const selectByIndex = (index: number) => {
    const item = items[index];
    if (!item) return;

    onChange(item.id);
    requestAnimationFrame(() => document.getElementById(`${idPrefix}-${item.id}`)?.focus());
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    selectByIndex(nextIndex);
  };

  return (
    <div
      className={cn("pixel-choice-bar", `pixel-choice-bar--${variant}`, className)}
      role={kind === "tabs" ? "tablist" : "group"}
      aria-label={ariaLabel}
    >
      {items.map((item, index) => {
        const active = item.id === value;

        return (
          <button
            key={item.id}
            id={`${idPrefix}-${item.id}`}
            type="button"
            className={cn("pixel-choice", active && "is-active")}
            role={kind === "tabs" ? "tab" : undefined}
            aria-selected={kind === "tabs" ? active : undefined}
            aria-pressed={kind === "filters" ? active : undefined}
            aria-controls={kind === "tabs" ? panelId : undefined}
            tabIndex={kind === "tabs" ? (active ? 0 : -1) : undefined}
            onClick={() => onChange(item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.icon ? (
              <span className="pixel-choice-icon" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <span className="pixel-choice-label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
