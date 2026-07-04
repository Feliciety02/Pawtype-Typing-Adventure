const emojiToPath: Record<string, string> = {
  "🔥": "/Icons/fire.png",
  "⭐": "/Icons/star.png",
  "🌟": "/Icons/glowing-star.png",
  "★": "/Icons/star.png",
  "🎯": "/Icons/target.png",
  "🪙": "/Icons/coin.png",
  "⚡": "/Icons/zap.png",
  "💡": "/Icons/bulb.png",
  "💪": "/Icons/flex.png",
  "🧠": "/Icons/brain.png",
  "🤖": "/Icons/robot.png",
  "🐾": "/Icons/paw-print.png",
  "🌱": "/Icons/seedling.png",
  "✨": "/Icons/sparkles.png",
  "🎁": "/Icons/gift.png",
  "👍": "/Icons/thumbs-up.png",
  "✅": "/Icons/check-mark.png",
  "☕": "/Icons/coffee.png",
  "🌲": "/Icons/evergreen-tree.png",
  "🌊": "/Icons/water-wave.png",
  "🌸": "/Icons/cherry-blossom.png",
  "🌻": "/Icons/sunflower.png",
  "🍂": "/Icons/fallen-leaf.png",
  "❤️": "/Icons/red-heart.png",
  "🤍": "/Icons/white-heart.png",
  "🏡": "/Icons/nav/home.png",
  "🎖️": "/Icons/nav/achievements.png",
  "⏳": "/Icons/hourglass.png",
  "⏰": "/Icons/alarm-clock.png",
  "⏱️": "/Icons/stopwatch.png",
  "🔔": "/Icons/bell.png",
  "🔒": "/Icons/lock.png",
  "🏆": "/Icons/trophy.png",
  "⌨": "/Icons/nav/keyboard.png",
  "🗺": "/Icons/nav/map.png",
  "📖": "/Icons/nav/book.png",
  "🛒": "/Icons/nav/cart.png",
  "📊": "/Icons/nav/chart.png",
  "🎉": "/Icons/sparkles.png",
  "💯": "/Icons/star.png",
  "📝": "/Icons/nav/keyboard.png",
  "💎": "/Icons/glowing-star.png",
  "👑": "/Icons/star.png",
  "🏅": "/Icons/trophy.png",
  "🥇": "/Icons/star.png",
};

export function iconFor(emoji: string): string | undefined {
  return emojiToPath[emoji];
}

export function hasIcon(emoji: string): boolean {
  return emoji in emojiToPath;
}

export function pixelIcon(emoji: string, className = "pixel-icon"): string | { src: string; className: string } {
  const path = emojiToPath[emoji];
  if (!path) return emoji;
  return { src: path, className };
}
