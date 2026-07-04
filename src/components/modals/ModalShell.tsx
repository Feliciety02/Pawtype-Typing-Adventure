import { useEffect, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

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

export function PixelFrame({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
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
  className,
  frameClassName,
  contentClassName,
  showCloseButton = true,
  closeLabel = "Close modal",
}: ModalShellProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return createPortal(
    <div
      className="pixel-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div className={cn("pixel-modal-shell", className)} onClick={(event) => event.stopPropagation()}>
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
        <img src="/Icons/star.png" alt="" className="pixel-reward-icon" />
        <span className="pixel-reward-value">+{xp}</span>
        <span className="pixel-reward-label">XP</span>
      </div>
      <div className="pixel-reward-divider" aria-hidden="true" />
      <div className="pixel-reward-item">
        <img src="/Icons/coin.png" alt="" className="pixel-reward-icon" />
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

type PixelButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
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
    <button
      type={type}
      className={cn("pixel-modal-btn", variant === "primary" && "is-primary", className)}
      {...props}
    >
      {icon ? <span className="pixel-modal-btn-icon">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
