import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { cn } from "@/lib/utils/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export function PixelCornerOrnaments() {
  return (
    <>
      <span className="pixel-modal-corner pixel-modal-corner-tl" aria-hidden="true" />
      <span className="pixel-modal-corner pixel-modal-corner-tr" aria-hidden="true" />
      <span className="pixel-modal-corner pixel-modal-corner-bl" aria-hidden="true" />
      <span className="pixel-modal-corner pixel-modal-corner-br" aria-hidden="true" />
    </>
  );
}

export function PixelFrame({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pixel-frame", className)} {...props}>
      <PixelCornerOrnaments />
      <div className="pixel-frame-inner">{children}</div>
    </div>
  );
}

type ModalShellProps = {
  ariaLabel: string;
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
  className?: string;
  frameClassName?: string;
  contentClassName?: string;
  showCloseButton?: boolean;
  closeLabel?: string;
};

export function ModalShell({
  ariaLabel,
  onClose,
  children,
  overlayClassName,
  className,
  frameClassName,
  contentClassName,
  showCloseButton = true,
  closeLabel = "Close modal",
}: ModalShellProps) {
  const onCloseRef = useRef(onClose);
  const shellRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement;

    const shell = shellRef.current;
    if (shell) {
      const first = shell.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      first?.focus();
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const shell = shellRef.current;
      if (!shell) return;
      const focusable = shell.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    window.addEventListener("keydown", trapFocus);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("keydown", trapFocus);
      prevFocusRef.current?.focus();
    };
  }, []);

  return createPortal(
    <div
      className={cn("pixel-modal-overlay", overlayClassName)}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        ref={shellRef}
        className={cn("pixel-modal-shell", className)}
        onClick={(event) => event.stopPropagation()}
      >
        <PixelFrame className={cn("pixel-modal-frame", frameClassName)}>
          {showCloseButton && (
            <button
              type="button"
              className="pixel-modal-close"
              onClick={onClose}
              aria-label={closeLabel}
            >
              <X size={16} />
            </button>
          )}
          <div className={cn("pixel-modal-content", contentClassName)}>{children}</div>
        </PixelFrame>
      </div>
    </div>,
    document.body,
  );
}

type StatCardProps = {
  icon: ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
};

export function StatCard({ icon, label, value, valueClassName }: StatCardProps) {
  return (
    <div className="pixel-stat-card">
      <div className="pixel-stat-card-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="pixel-stat-card-label">{label}</div>
      <div className={cn("pixel-stat-card-value", valueClassName)}>{value}</div>
    </div>
  );
}

type RewardCardProps = {
  xp: number;
  coins: number;
};

export function RewardCard({ xp, coins }: RewardCardProps) {
  return (
    <div className="pixel-reward-card">
      <div className="pixel-reward-item">
        <PixelIcon emoji="⭐" className="pixel-reward-icon" />
        <span className="pixel-reward-value">+{xp}</span>
        <span className="pixel-reward-label">XP</span>
      </div>
      <div className="pixel-reward-divider" aria-hidden="true" />
      <div className="pixel-reward-item">
        <PixelIcon emoji="🪙" className="pixel-reward-icon" />
        <span className="pixel-reward-value">+{coins}</span>
        <span className="pixel-reward-label">Coins</span>
      </div>
    </div>
  );
}

type CoachTipCardProps = {
  children: ReactNode;
};

export function CoachTipCard({ children }: CoachTipCardProps) {
  return (
    <div className="pixel-coach-card">
      <div className="pixel-coach-badge" aria-hidden="true">
        <span className="pixel-coach-badge-icon">!</span>
      </div>
      <div className="pixel-coach-title">Tip</div>
      <div className="pixel-coach-copy">{children}</div>
    </div>
  );
}

type PixelButtonProps = Omit<ButtonProps, "variant"> & {
  variant?: "primary" | "secondary";
  icon?: ReactNode;
};

export function PixelButton({
  className,
  children,
  variant = "secondary",
  icon,
  type = "button",
  ...props
}: PixelButtonProps) {
  return (
    <Button
      type={type}
      variant={variant === "primary" ? "default" : "secondary"}
      className={cn("pixel-modal-btn", variant === "primary" && "is-primary", className)}
      {...props}
    >
      {icon ? <span className="pixel-modal-btn-icon">{icon}</span> : null}
      <span>{children}</span>
    </Button>
  );
}
