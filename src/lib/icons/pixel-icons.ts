const emojiToPath: Record<string, string> = {
  "🔥": "/icons/fire.webp",
  "⭐": "/icons/star.webp",
  "🌟": "/icons/glowing-star.webp",
  "★": "/icons/star.webp",
  "🎯": "/icons/target.webp",
  "🪙": "/icons/coin.webp",
  "⚡": "/icons/zap.webp",
  "💡": "/icons/bulb.webp",
  "💪": "/icons/flex.webp",
  "🧠": "/icons/brain.webp",
  "🤖": "/icons/robot.webp",
  "🐾": "/icons/paw-print.webp",
  "🌱": "/icons/seedling.webp",
  "✨": "/icons/sparkles.webp",
  "🎁": "/icons/gift.webp",
  "👍": "/icons/thumbs-up.webp",
  "✅": "/icons/check-mark.webp",
  "☕": "/icons/coffee.webp",
  "🌲": "/icons/evergreen-tree.webp",
  "🌊": "/icons/water-wave.webp",
  "🌸": "/icons/cherry-blossom.webp",
  "🌻": "/icons/sunflower.webp",
  "🍂": "/icons/fallen-leaf.webp",
  "❤️": "/icons/red-heart.webp",
  "🤍": "/icons/white-heart.webp",
  "🏡": "/icons/nav/home.webp",
  "🎖️": "/icons/nav/achievements.webp",
  "⏳": "/icons/hourglass.webp",
  "⏰": "/icons/alarm-clock.webp",
  "⏱️": "/icons/stopwatch.webp",
  "🔔": "/icons/bell.webp",
  "🔒": "/icons/lock.webp",
  "🏆": "/icons/trophy.webp",
  "⌨": "/icons/nav/keyboard.webp",
  "🗺": "/icons/nav/map.webp",
  "📖": "/icons/nav/book.webp",
  "🛒": "/icons/nav/cart.webp",
  "📊": "/icons/nav/chart.webp",
  "🎉": "/icons/sparkles.webp",
  "💯": "/icons/star.webp",
  "📝": "/icons/nav/keyboard.webp",
  "💎": "/icons/glowing-star.webp",
  "👑": "/icons/star.webp",
  "🏅": "/icons/trophy.webp",
  "🥇": "/icons/star.webp",
  "🏠": "/icons/house.webp",
  "🔤": "/icons/nav/keyboard.webp",
  "📚": "/icons/nav/book.webp",
  "💰": "/icons/coin.webp",
  "🎊": "/icons/sparkles.webp",
  "💖": "/icons/red-heart.webp",
  "💜": "/icons/white-heart.webp",
  "💛": "/icons/star.webp",
  "🧡": "/icons/fire.webp",
  "💫": "/icons/glowing-star.webp",
  "🌼": "/icons/cherry-blossom.webp",
  "🌺": "/icons/cherry-blossom.webp",
  "🌙": "/icons/star.webp",
  "❄️": "/icons/white-heart.webp",
  "🧊": "/icons/white-heart.webp",
  "🌧️": "/icons/water-wave.webp",
  "💧": "/icons/water-wave.webp",
  "🐚": "/icons/water-wave.webp",
  "🐠": "/icons/water-wave.webp",
  "🌿": "/icons/seedling.webp",
  "🍀": "/icons/seedling.webp",
  "🍃": "/icons/seedling.webp",
  "🪵": "/icons/evergreen-tree.webp",
  "🐝": "/icons/sunflower.webp",
  "🦋": "/icons/cherry-blossom.webp",
};

export function iconFor(emoji: string): string | undefined {
  return emojiToPath[emoji];
}

export function hasIcon(emoji: string): boolean {
  return emoji in emojiToPath;
}

export function pixelIcon(
  emoji: string,
  className = "pixel-icon",
): string | { src: string; className: string } {
  const path = emojiToPath[emoji];
  if (!path) return emoji;
  return { src: path, className };
}
