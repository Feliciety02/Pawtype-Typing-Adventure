import type { ReactNode } from "react";

import { cn } from "@/lib/utils/utils";

type AnimatedTabPanelProps = {
  panelKey: string;
  id: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
};

export function AnimatedTabPanel({
  panelKey,
  id,
  labelledBy,
  className,
  children,
}: AnimatedTabPanelProps) {
  return (
    <div
      key={panelKey}
      id={id}
      className={cn("pixel-tab-panel-motion", className)}
      role="tabpanel"
      aria-labelledby={labelledBy}
    >
      {children}
    </div>
  );
}
