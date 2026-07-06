import { useRef, useState, useEffect, useMemo } from "react";
import {
  measureVisibleImageBounds,
  NODE_IMAGE_BOUNDS_CACHE,
  type VisibleImageBounds,
} from "@/lib/adventure/adventureData";

export function AdventureNodeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [bounds, setBounds] = useState<VisibleImageBounds | null>(
    NODE_IMAGE_BOUNDS_CACHE.get(src) ?? null,
  );
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let cancelled = false;

    measureVisibleImageBounds(src)
      .then((nextBounds) => {
        if (!cancelled) setBounds(nextBounds);
      })
      .catch(() => {
        if (!cancelled) setBounds(null);
      });

    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const image = imageRef.current;
    const frame = image?.parentElement;
    if (!frame || typeof ResizeObserver === "undefined") return;

    const updateSize = () =>
      setFrameSize({
        width: frame.clientWidth,
        height: frame.clientHeight,
      });

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const measuredStyle = useMemo(() => {
    if (!bounds || frameSize.width === 0 || frameSize.height === 0) return undefined;

    const scale = Math.min(
      frameSize.width / bounds.naturalWidth,
      frameSize.height / bounds.naturalHeight,
    );
    const width = bounds.naturalWidth * scale;
    const height = bounds.naturalHeight * scale;
    const left = (frameSize.width - width) / 2;
    const top = -bounds.top * scale;

    return {
      width: `${width}px`,
      height: `${height}px`,
      left: `${left}px`,
      top: `${top}px`,
    } as Record<string, string>;
  }, [bounds, frameSize.height, frameSize.width]);

  return (
    <img
      ref={imageRef}
      src={src}
      alt={alt}
      className={`${className} ${measuredStyle ? "adventure-node-img-measured" : ""}`}
      style={measuredStyle}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  );
}
