import { RotateCcw, ArrowLeft, ArrowRight, X } from "lucide-react";
import { PixelMascot } from "../PixelMascot";
import {
  CoachTipCard,
  PixelButton,
  PixelFrame,
  RewardCard,
  StatCard,
} from "../modals/ModalShell";

type QuestResultsModalProps = {
  open: boolean;
  result: "win" | "lose" | null;
  stageName: string;
  goal: number;
  minAccuracy: number;
  wpm: number;
  accuracy: number;
  elapsedSeconds: number;
  xp: number;
  coins: number;
  alreadyCompleted: boolean;
  message: string;
  coachTip: string;
  onReplay: () => void;
  onDismiss: () => void;
};

export function QuestResultsModal({
  open,
  result,
  stageName,
  goal,
  minAccuracy,
  wpm,
  accuracy,
  elapsedSeconds,
  xp,
  coins,
  alreadyCompleted,
  message,
  coachTip,
  onReplay,
  onDismiss,
}: QuestResultsModalProps) {
  if (!open || !result) return null;

  const success = result === "win";

  return (
    <div className="quest-results-overlay animate-pixel-pop">
      <PixelFrame className="quest-results-frame">
        <button
          type="button"
          className="pixel-modal-close quest-results-close"
          onClick={onDismiss}
          aria-label="Close quest results"
        >
          <X size={16} />
        </button>
        <div className="quest-results-layout">
          <div className="quest-results-left">
            <div className="quest-results-mascot">
              <PixelMascot mood={success ? "happy" : "oops"} size={72} />
            </div>
            <div className="quest-results-kicker">{stageName}</div>
            <h2 className="quest-results-title">
              {success ? "Stage Cleared!" : "Quest Failed"}
            </h2>
            <p className="quest-results-message">{message}</p>
            <CoachTipCard>{coachTip}</CoachTipCard>
          </div>

          <div className="quest-results-right">
            <div className="quest-results-stats">
              <StatCard
                icon={<img src="/Icons/nav/keyboard.png" alt="" className="pixel-stat-art" />}
                label="WPM"
                value={String(wpm)}
                valueClassName={success ? "is-sky" : undefined}
              />
              <StatCard
                icon={<img src="/Icons/target.png" alt="" className="pixel-stat-art" />}
                label="Accuracy"
                value={`${accuracy}%`}
                valueClassName={accuracy >= minAccuracy ? "is-sky" : undefined}
              />
              <StatCard
                icon={<img src="/Icons/hourglass.png" alt="" className="pixel-stat-art" />}
                label="Time"
                value={`${elapsedSeconds.toFixed(0)}s`}
              />
            </div>

            {success ? (
              <RewardCard xp={alreadyCompleted ? 0 : xp} coins={alreadyCompleted ? 0 : coins} />
            ) : (
              <div className="quest-results-requirements">
                <div className="quest-results-requirement-card">
                  <span>Goal</span>
                  <strong>{goal} WPM</strong>
                </div>
                <div className="quest-results-requirement-card">
                  <span>Accuracy</span>
                  <strong>{minAccuracy}%+</strong>
                </div>
              </div>
            )}

            <div className="quest-results-actions">
              <PixelButton variant="primary" icon={<RotateCcw size={16} />} onClick={onReplay}>
                {success ? "Replay Stage" : "Retry Stage"}
              </PixelButton>
              <PixelButton
                variant="secondary"
                icon={success ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                onClick={onDismiss}
              >
                {success ? "Continue Adventure" : "Back to Map"}
              </PixelButton>
            </div>
          </div>
        </div>
      </PixelFrame>
    </div>
  );
}
