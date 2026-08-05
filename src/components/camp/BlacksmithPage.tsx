import { useEffect, useState, type RefObject } from "react";

import { useThemeMode } from "@/hooks/use-theme-mode";
import KeyboardWorkshopPage from "@/features/keyboard-workshop/page";
import { useWorkshopStore } from "@/features/keyboard-workshop/store";
import { CampBackButton } from "./CampBackButton";

type BlacksmithPageProps = {
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onBack: () => void;
};

export function BlacksmithPage({ backButtonRef, onBack }: BlacksmithPageProps) {
  const { dark } = useThemeMode();
  const keyboardName = useWorkshopStore((state) => state.currentBuild.name);
  const [nightBackgroundReady, setNightBackgroundReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nightBackground = new Image();
    const markReady = () => {
      if (!cancelled) setNightBackgroundReady(true);
    };

    nightBackground.decoding = "async";
    nightBackground.src = "/camp/blacksmith-page/blacksmith-background-evening.webp";
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
      <div className="camp-interior-toolbar camp-blacksmith-toolbar">
        <CampBackButton ref={backButtonRef} onClick={onBack} />
        <div className="camp-blacksmith-heading">
          <img
            className="camp-blacksmith-heading__plaque"
            src="/workshop/header/blacksmith-workshop-plaque.webp"
            alt="Blacksmith Workshop"
            draggable={false}
          />
          <p className="camp-blacksmith-heading__keyboard-name" aria-label={`Keyboard name: ${keyboardName}`}>
            {keyboardName}
          </p>
        </div>
      </div>
      <KeyboardWorkshopPage embedded />
    </section>
  );
}
