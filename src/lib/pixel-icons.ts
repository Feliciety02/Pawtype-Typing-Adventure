const emojiToPath: Record<string, string> = {
  "🔥": "/Icons/flame.png",
  "⭐": "/Icons/star.png",
  "🌟": "/Icons/glowing-star.png",
  "★": "/Icons/star.png",
  "🎯": "/Icons/dart.png",
  "🪙": "/Icons/coin.png",
  "⚡": "/Icons/lightning-bolt.png",
  "💡": "/Icons/lightbulb.png",
  "💪": "/Icons/flexedarm.png",
  "🧠": "/Icons/brain.png",
  "🤖": "/Icons/robot-head.png",
  "🐾": "/Icons/paw-print.png",
  "🌱": "/Icons/sprout.png",
  "✨": "/Icons/sparkles.png",
  "🎁": "/Icons/giftbox.png",
  "👍": "/Icons/thumbsup.png",
  "✅": "/Icons/checkmark.png",
  "☕": "/Icons/coffee-cup.png",
  "🌲": "/Icons/pine-tree.png",
  "🌊": "/Icons/ocean-wave.png",
  "🌸": "/Icons/sakura-blossom.png",
  "🌻": "/Icons/sunflower.png",
  "🍂": "/Icons/autumn-leaf.png",
  "❤️": "/Icons/red-heart.png",
  "🤍": "/Icons/white-heart.png",
  "🏡": "/Icons/cozy-home.png",
  "⏰": "/Icons/clock.png",
  "⏱️": "/Icons/stopwatch.png",
  "🔔": "/Icons/notification.png",
  "🔒": "/Icons/lock.png",
  "🏆": "/Icons/trophy.png",
  "⌨": "/Icons/nav/practice.png",
  "🗺": "/Icons/nav/adventure.png",
  "📖": "/Icons/nav/lessons.png",
  "🛒": "/Icons/nav/shop.png",
  "📊": "/Icons/nav/stats.png",
  "🎉": "/Icons/sparkles.png",
  "💯": "/Icons/star.png",
  "📝": "/Icons/nav/practice.png",
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
