import { useEffect, useState, type RefObject } from "react";
import { Mail } from "lucide-react";

import { useThemeMode } from "@/hooks/use-theme-mode";
import { CampBackButton } from "./CampBackButton";

type MailboxPageProps = {
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onBack: () => void;
};

export function MailboxPage({ backButtonRef, onBack }: MailboxPageProps) {
  const { dark } = useThemeMode();
  const [nightBackgroundReady, setNightBackgroundReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const nightBackground = new Image();
    const markReady = () => {
      if (!cancelled) setNightBackgroundReady(true);
    };

    nightBackground.decoding = "async";
    nightBackground.src = "/camp/mailbox-page/mailbox_background_evening.webp";
    if (nightBackground.complete) markReady();
    else nightBackground.addEventListener("load", markReady, { once: true });

    return () => {
      cancelled = true;
      nightBackground.removeEventListener("load", markReady);
    };
  }, []);

  return (
    <section
      className={`camp-interior-page camp-mailbox-page ${dark && nightBackgroundReady ? "is-night-background" : ""}`}
      aria-label="Mailbox"
    >
      <div className="camp-interior-toolbar camp-mailbox-toolbar">
        <CampBackButton ref={backButtonRef} onClick={onBack} />
        <div>
          <h1>Mailbox</h1>
          <p>Letters, event notices, and rewards arrive here.</p>
        </div>
      </div>

      <div className="camp-mailbox-content">
        <div className="camp-mailbox-empty pixel-card">
          <Mail aria-hidden="true" />
          <div>
            <span className="camp-mailbox-kicker">Camp Post</span>
            <h2>No new letters</h2>
            <p>Return after your next adventure or daily event.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
