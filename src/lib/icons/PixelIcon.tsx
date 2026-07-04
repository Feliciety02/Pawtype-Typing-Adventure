import { useState } from "react";
import { iconFor } from "./pixel-icons";

interface PixelIconProps {
  emoji: string;
  className?: string;
  alt?: string;
  /** Override the looked-up path when the emoji→path mapping doesn't match */
  src?: string;
}

export function PixelIcon({ emoji, className = "pixel-icon", alt, src: srcProp }: PixelIconProps) {
  const [failed, setFailed] = useState(false);
  const path = srcProp || iconFor(emoji);

  if (failed || !path) {
    return <span className={className} role="img" aria-label={alt || emoji}>{emoji}</span>;
  }

  return (
    <img
      src={path}
      className={className}
      alt={alt || emoji}
      onError={() => setFailed(true)}
    />
  );
}
