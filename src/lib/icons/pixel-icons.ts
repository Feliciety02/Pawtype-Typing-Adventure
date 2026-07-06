const emojiToPath: Record<string, string> = {
  "🔥": "/icons/fire.png",
  "⭐": "/icons/star.png",
  "🌟": "/icons/glowing-star.png",
  "★": "/icons/star.png",
  "🎯": "/icons/target.png",
  "🪙": "/icons/coin.png",
  "⚡": "/icons/zap.png",
  "💡": "/icons/bulb.png",
  "💪": "/icons/flex.png",
  "🧠": "/icons/brain.png",
  "🤖": "/icons/robot.png",
  "🐾": "/icons/paw-print.png",
  "🌱": "/icons/seedling.png",
  "✨": "/icons/sparkles.png",
  "🎁": "/icons/gift.png",
  "👍": "/icons/thumbs-up.png",
  "✅": "/icons/check-mark.png",
  "☕": "/icons/coffee.png",
  "🌲": "/icons/evergreen-tree.png",
  "🌊": "/icons/water-wave.png",
  "🌸": "/icons/cherry-blossom.png",
  "🌻": "/icons/sunflower.png",
  "🍂": "/icons/fallen-leaf.png",
  "❤️": "/icons/red-heart.png",
  "🤍": "/icons/white-heart.png",
  "🏡": "/icons/nav/home.png",
  "🎖️": "/icons/nav/achievements.png",
  "⏳": "/icons/hourglass.png",
  "⏰": "/icons/alarm-clock.png",
  "⏱️": "/icons/stopwatch.png",
  "🔔": "/icons/bell.png",
  "🔒": "/icons/lock.png",
  "🏆": "/icons/trophy.png",
  "⌨": "/icons/nav/keyboard.png",
  "🗺": "/icons/nav/map.png",
  "📖": "/icons/nav/book.png",
  "🛒": "/icons/nav/cart.png",
  "📊": "/icons/nav/chart.png",
  "🎉": "/icons/sparkles.png",
  "💯": "/icons/star.png",
  "📝": "/icons/nav/keyboard.png",
  "💎": "/icons/glowing-star.png",
  "👑": "/icons/star.png",
  "🏅": "/icons/trophy.png",
  "🥇": "/icons/star.png",
  "🏠": "/icons/house.png",
  "🔤": "/icons/nav/keyboard.png",
  "📚": "/icons/nav/book.png",
  "💰": "/icons/coin.png",
  "🎊": "/icons/sparkles.png",
  "💖": "/icons/red-heart.png",
  "💜": "/icons/white-heart.png",
  "💛": "/icons/star.png",
  "🧡": "/icons/fire.png",
  "💫": "/icons/glowing-star.png",
  "🌼": "/icons/cherry-blossom.png",
  "🌺": "/icons/cherry-blossom.png",
  "🌙": "/icons/star.png",
  "❄️": "/icons/white-heart.png",
  "🧊": "/icons/white-heart.png",
  "🌧️": "/icons/water-wave.png",
  "💧": "/icons/water-wave.png",
  "🐚": "/icons/water-wave.png",
  "🐠": "/icons/water-wave.png",
  "🌿": "/icons/seedling.png",
  "🍀": "/icons/seedling.png",
  "🍃": "/icons/seedling.png",
  "🪵": "/icons/evergreen-tree.png",
  "🐝": "/icons/sunflower.png",
  "🦋": "/icons/cherry-blossom.png",
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
