import { Play, RotateCcw } from "lucide-react";
import { PixelIcon } from "../../lib/icons/PixelIcon";
import { PixelMascot } from "../coach/PixelMascot";
import { CoachTipCard, ModalShell, PixelButton, RewardCard, StatCard } from "./ModalShell";

type PracticeResultsModalProps = {
  accuracy: number;
  bestCombo: number;
  elapsedSeconds: number;
  xp: number;
  coins: number;
  feedbackMessage: string;
  coachTip: string;
  practicedKeys: string[];
  onContinue: () => void;
  onRetry: () => void;
  onClose: () => void;
};

export function PracticeResultsModal({
  accuracy,
  bestCombo,
  elapsedSeconds,
  xp,
  coins,
  feedbackMessage,
  coachTip,
  practicedKeys,
  onContinue,
  onRetry,
  onClose,
}: PracticeResultsModalProps) {
  const practicedSummary =
    practicedKeys.length > 0 ? practicedKeys.join(", ").toUpperCase() : "CLEAN RUN";

  return (
    <ModalShell
      ariaLabel="Practice results"
      onClose={onClose}
      className="pixel-modal-shell-results"
      frameClassName="pixel-modal-frame-results"
      contentClassName="pixel-modal-content-results"
    >
      <div className="practice-results-layout">
        <div className="practice-results-left">
          <div className="practice-results-mascot">
            <PixelMascot mood="happy" size={82} />
          </div>
          <h2 className="practice-results-title">Practice Complete!</h2>
          <div className="practice-results-divider" aria-hidden="true">
            <span />
            <i>paw</i>
            <span />
          </div>
          <p className="practice-results-feedback">{feedbackMessage}</p>
          <CoachTipCard>{coachTip}</CoachTipCard>
        </div>

        <div className="practice-results-right">
          <div className="practice-results-stats">
            <StatCard
              icon={<PixelIcon emoji="🎯" className="pixel-stat-art" />}
              label="Accuracy"
              value={`${accuracy}%`}
              valueClassName="is-sky"
            />
            <StatCard
              icon={<PixelIcon emoji="🔥" className="pixel-stat-art" />}
              label="Best Combo"
              value={String(bestCombo)}
              valueClassName="is-gold"
            />
            <StatCard
              icon={<PixelIcon emoji="⏳" className="pixel-stat-art" />}
              label="Time"
              value={`${elapsedSeconds.toFixed(0)}s`}
              valueClassName="is-sky"
            />
          </div>

          <RewardCard xp={xp} coins={coins} />

          <div className="practice-results-practiced">
            <PixelIcon emoji="🎯" className="practice-results-practiced-icon" />
            <span className="practice-results-practiced-label">Practiced:</span>
            <span className="practice-results-practiced-value">{practicedSummary}</span>
          </div>

          <div className="practice-results-actions">
            <PixelButton
              variant="primary"
              icon={<Play size={16} strokeWidth={2.25} />}
              onClick={onContinue}
            >
              Continue Practice
            </PixelButton>
            <PixelButton
              variant="secondary"
              icon={<RotateCcw size={16} strokeWidth={2.25} />}
              onClick={onRetry}
            >
              Try Again
            </PixelButton>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
