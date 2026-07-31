import { useEffect, useState, type RefObject } from "react";

import { useThemeMode } from "@/hooks/use-theme-mode";
import KeyboardWorkshopPage from "@/features/keyboard-workshop/page";

type BlacksmithPageProps = {
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onBack: () => void;
};

export function BlacksmithPage({ backButtonRef, onBack }: BlacksmithPageProps) {
  const { dark } = useThemeMode();
  const [nightBackgroundReady, setNightBackgroundReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nightBackground = new Image();
    const markReady = () => {
      if (!cancelled) setNightBackgroundReady(true);
    };

    nightBackground.decoding = "async";
    nightBackground.src = "/camp/blacksmith-page/blacksmith-background-evening.png";
    if (nightBackground.complete) markReady();
    else nightBackground.addEventListener("load", markReady, { once: true });

    return () => {
      cancelled = true;
      nightBackground.removeEventListener("load", markReady);
    };
  }, []);

  return (
    <section
      className={`camp-interior-page camp-blacksmith-page ${dark && nightBackgroundReady ? "is-night-background" : ""}`}
      aria-label="Blacksmith Forge"
    >
      <KeyboardWorkshopPage embedded backButtonRef={backButtonRef} onBack={onBack} />
    </section>
  );
}
