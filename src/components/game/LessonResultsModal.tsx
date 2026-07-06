import { PixelIcon } from "../../lib/icons/PixelIcon";
import { PixelButton, ModalShell, StatCard, RewardCard } from "../modals/ModalShell";

type Props = {
  accuracy: number;
  wpm: number;
  bestCombo: number;
  lessonTargetAccuracy?: number;
  lessonDifficulty?: string;
  lessonWordCount?: number;
  coachLoading: boolean;
  coachError: boolean;
  coachInsight: { text: string } | null;
  onReset: () => void;
  onNextLesson?: () => void;
  onClose: () => void;
  hasNext?: boolean;
};

export function LessonResultsModal({
  accuracy,
  wpm,
  bestCombo,
  lessonTargetAccuracy,
  lessonDifficulty,
  lessonWordCount,
  coachLoading,
  coachError,
  coachInsight,
  onReset,
  onNextLesson,
  onClose,
  hasNext,
}: Props) {
  const stars = (() => {
    if (lessonTargetAccuracy == null) return 1;
    if (accuracy >= Math.min(lessonTargetAccuracy + 5, 100)) return 3;
    if (accuracy >= lessonTargetAccuracy) return 2;
    return 1;
  })();

  const rewards =
    lessonDifficulty && lessonWordCount
      ? (() => {
          const base: Record<string, number> = {
            beginner: 25,
            easy: 50,
            intermediate: 75,
            advanced: 100,
            expert: 150,
            master: 200,
          };
          const rewardXp = (base[lessonDifficulty] ?? 50) + Math.floor(lessonWordCount / 5);
          const rewardCoins = Math.round(rewardXp / 2);
          const rewardPetExp = Math.max(1, Math.floor(lessonWordCount / 10));
          return { rewardXp, rewardCoins, rewardPetExp };
        })()
      : null;

  return (
    <ModalShell
      ariaLabel="Lesson results"
      onClose={onClose}
      className="pixel-modal-shell-lesson"
      frameClassName="pixel-modal-frame-lesson"
    >
      <div className="lesson-results-layout">
        <div className="lesson-results-stars">
          {[1, 2, 3].map((star) => (
            <span key={star} className={star <= stars ? "is-filled" : ""}>
              <PixelIcon emoji="⭐" />
            </span>
          ))}
        </div>

        <div className="lesson-results-title">Lesson Complete!</div>

        <div className="lesson-results-stats">
          <StatCard
            icon={<PixelIcon emoji="⌨" className="pixel-stat-art" />}
            label="WPM"
            value={String(wpm)}
          />
          <StatCard
            icon={<PixelIcon emoji="🎯" className="pixel-stat-art" />}
            label="Accuracy"
            value={`${accuracy}%`}
            valueClassName="is-sky"
          />
          <StatCard
            icon={<PixelIcon emoji="🔥" className="pixel-stat-art" />}
            label="Combo"
            value={String(bestCombo)}
            valueClassName="is-gold"
          />
        </div>

        {rewards && (
          <div className="lesson-results-bonus">
            <RewardCard xp={rewards.rewardXp} coins={rewards.rewardCoins} />
            <div className="lesson-results-pet-exp">
              <span>Pet EXP</span>
              <strong>+{rewards.rewardPetExp}</strong>
            </div>
          </div>
        )}

        <div className="lesson-results-tip">
          {coachLoading
            ? "Analyzing your run..."
            : coachError
              ? "Keep typing and Ixll have feedback ready!"
              : (coachInsight?.text ?? "Great work out there!")}
        </div>

        <div className="lesson-results-actions">
          <PixelButton variant="secondary" onClick={onReset} icon={<span>?</span>}>
            Retry
          </PixelButton>
          {hasNext ? (
            <PixelButton variant="primary" onClick={() => onNextLesson?.()} icon={<span>?</span>}>
              Next Lesson
            </PixelButton>
          ) : (
            <PixelButton variant="primary" onClick={() => onClose?.()} icon={<span>?</span>}>
              Back to Lessons
            </PixelButton>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
