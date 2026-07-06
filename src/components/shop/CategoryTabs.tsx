export function CategoryTabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((c) => {
        const active = c.id === value;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className="font-pixel text-[0.6rem] px-3 py-1.5 rounded"
            style={{
              background: active ? "var(--color-primary)" : "var(--color-muted)",
              color: active ? "var(--color-primary-foreground)" : "var(--color-foreground)",
              border: "2px solid var(--color-border)",
            }}
          >
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
