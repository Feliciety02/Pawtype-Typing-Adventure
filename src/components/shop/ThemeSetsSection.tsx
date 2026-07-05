import { WORLDS, type WorldId } from "../shared/WorldTheme";
import { THEME_BACKGROUND } from "../../lib/game/themeAssets";

export function ThemeSetsSection({ activeWorld, onSelectWorld }: { activeWorld: WorldId; onSelectWorld: (world: WorldId) => void }) {
  return (
    <section className="pixel-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <div className="font-pixel text-[0.65rem] uppercase text-muted-foreground mb-2">World Preview</div>
          <h2 className="text-3xl leading-none">Theme Sets</h2>
          <p className="font-pixel text-[0.65rem] text-muted-foreground mt-2 max-w-[60ch]">
            Each world has its own colors, artwork, and mood. Pick a theme to change the full UI.
          </p>
        </div>
        <div className="pixel-card-sm px-3 py-2 max-w-sm">
          <div className="font-pixel text-[0.62rem] uppercase text-muted-foreground mb-1">How it works</div>
          <p className="font-pixel text-[0.58rem] leading-relaxed">
            Choose a world, the background preview changes, and the whole UI palette updates with it.
          </p>
        </div>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4">
        {WORLDS.map((theme) => {
          const isActive = theme.id === activeWorld;
          return (
            <button key={theme.id} type="button" onClick={() => onSelectWorld(theme.id)}
              className="pixel-card-sm p-3 text-left transition-transform hover:-translate-y-1"
              style={isActive ? { outline: "3px solid var(--color-primary)", outlineOffset: 2 } : undefined}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <div className="font-display text-3xl leading-none truncate">{theme.emoji} {theme.name}</div>
                  <p className="font-pixel text-[0.58rem] text-muted-foreground mt-1">{theme.blurb}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {theme.swatches.map((color, i) => (
                    <span key={i} style={{ width: 20, height: 20, background: color, border: "2px solid var(--color-border)", borderRadius: 4 }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-[1fr_112px] gap-3 items-stretch">
                <div className="rounded-md border-2 p-3" style={{ borderColor: "var(--color-border)", background: "color-mix(in oklab, var(--color-muted) 45%, transparent)" }}>
                  <div className="pixel-bar mb-3" style={{ height: 12 }}>
                    <div className="h-full" style={{ width: "36%", background: "var(--color-primary)" }} />
                  </div>
                  <div className="font-pixel text-[0.7rem] leading-7">
                    <div><span style={{ background: "color-mix(in oklab, var(--color-primary) 18%, transparent)" }}>pixel</span> glow willow ivory</div>
                    <div>garden cloud cinnamon moon</div>
                    <div>{theme.id === "forest" ? "forest moss leaf" : theme.id === "ocean" ? "ocean tide wave" : theme.id === "sakura" ? "sakura blossom petal" : theme.id === "castle" ? "castle king crown" : theme.id === "space" ? "stardust galaxy star" : theme.id === "autumn" ? "autumn leaf cider" : theme.id === "mushroom" ? "mushroom glow spore" : theme.id === "sunflower" ? "sunflower golden bee" : "latte cozy brew"}</div>
                  </div>
                </div>
                <div className="rounded-md border-2 overflow-hidden" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-card)" }}>
                  <div aria-hidden="true" style={{ width: "100%", aspectRatio: "1 / 1", backgroundImage: `url("${THEME_BACKGROUND[theme.id]}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[{ label: "WPM", value: "85" }, { label: "ACC", value: "96%" }, { label: "STREAK", value: "12" }, { label: "TIME", value: "12s" }].map((stat) => (
                  <div key={stat.label} className="pixel-card-sm px-2 py-1.5 text-center">
                    <div className="font-display text-lg leading-none">{stat.value}</div>
                    <div className="font-pixel text-[0.5rem] text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="font-pixel text-[0.55rem] text-muted-foreground uppercase">{isActive ? "Active world" : "Click to switch"}</span>
                <span className="pixel-btn pixel-btn-secondary" style={{ padding: "0.45rem 0.8rem", fontSize: "0.62rem" }}>{isActive ? "Using Theme" : "Use Theme"}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
