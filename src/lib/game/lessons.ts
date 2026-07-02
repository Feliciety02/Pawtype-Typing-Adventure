// Backwards-compatible re-exports. The real curriculum lives in ./curriculum.
export type { Lesson, LessonDifficulty, Unit } from "./curriculum";
export { UNITS, ALL_LESSONS as LESSONS, findLesson, loadCompletedLessons, markLessonCompleted, unitProgress } from "./curriculum";
