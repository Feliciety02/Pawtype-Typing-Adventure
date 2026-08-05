"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, RotateCw, Keyboard, Camera } from "lucide-react";
import { useWorkshopStore } from "../store";
import type { CameraPreset } from "../types";

const CAMERA_PRESETS: { id: CameraPreset; label: string }[] = [
  { id: "isometric", label: "Iso" },
  { id: "top", label: "Top" },
  { id: "front", label: "Front" },
  { id: "left", label: "Left" },
  { id: "right", label: "Right" },
  { id: "typing", label: "Typing" },
  { id: "keycap-closeup", label: "Key ↗" },
  { id: "case-closeup", label: "Case ↗" },
];

type FooterAction = "iso" | "front" | "reset" | "test" | "undo" | "redo";
type FooterUtilityAction = "save" | "delete" | "more";

function WorkshopFooterButton({
  action,
  label,
  active = false,
  emphasized = false,
  disabled = false,
  onClick,
}: {
  action: FooterAction;
  label: string;
  active?: boolean;
  emphasized?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const state = disabled
    ? "disabled"
    : pressed
      ? "pressed"
      : active || emphasized
        ? "active"
        : hovered
          ? "active"
          : "inactive";

  return (
    <button
      type="button"
      className="blacksmith-workshop-footer__button"
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => {
        setHovered(false);
        setPressed(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") setPressed(true);
      }}
      onKeyUp={() => setPressed(false)}
      disabled={disabled}
      aria-label={label}
      aria-pressed={
        action === "iso" || action === "front" || action === "test" ? active : undefined
      }
    >
      <img src={`/workshop/footer/${action}-${state}.webp`} alt="" draggable={false} />
    </button>
  );
}

function WorkshopFooterUtilityButton({
  action,
  label,
  active = false,
  onClick,
}: {
  action: FooterUtilityAction;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`blacksmith-workshop-footer__utility-button${active ? " is-active" : ""}`}
      onClick={onClick}
      aria-label={label}
      aria-pressed={action === "more" ? active : undefined}
      title={label}
    >
      <img src={`/workshop/footer/utility-${action}.webp`} alt="" draggable={false} />
    </button>
  );
}

function BlacksmithWorkshopFooter() {
  const {
    undo,
    redo,
    history,
    historyIndex,
    testTypingMode,
    setTestTypingMode,
    cameraPreset,
    setCameraPreset,
    resetCamera,
    currentBuild,
    saveBuild,
    deleteBuild,
    resetBuild,
    equipBuild,
    exportBuild,
  } = useWorkshopStore();
  const [saved, setSaved] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const moreButtonWrapRef = useRef<HTMLDivElement>(null);
  const [moreMenuPosition, setMoreMenuPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!showMore) return;

    const positionMenu = () => {
      const buttonBounds = moreButtonWrapRef.current?.getBoundingClientRect();
      if (!buttonBounds) return;
      setMoreMenuPosition({
        top: buttonBounds.top - 8,
        left: buttonBounds.right,
      });
    };

    positionMenu();
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [showMore]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const handleSave = () => {
    saveBuild();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };
  const handleDelete = () => {
    if (!window.confirm(`Delete "${currentBuild.name}" and start a new build?`)) return;
    deleteBuild(currentBuild.id);
    resetBuild();
    setShowMore(false);
  };
  const handleExport = () => {
    const url = URL.createObjectURL(new Blob([exportBuild()], { type: "application/json" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${currentBuild.name.replace(/\s+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setShowMore(false);
  };
  const handleEquip = () => {
    equipBuild(currentBuild.id);
    setShowMore(false);
  };

  return (
    <footer className="blacksmith-workshop-footer" role="toolbar" aria-label="Workshop controls">
      <img
        className="blacksmith-workshop-footer__panel"
        src="/workshop/footer/panel.webp"
        alt=""
        draggable={false}
      />
      <div className="blacksmith-workshop-footer__controls">
        <div className="blacksmith-workshop-footer__group blacksmith-workshop-footer__group--views">
          <WorkshopFooterButton
            action="iso"
            label="ISO view"
            active={cameraPreset === "isometric"}
            onClick={() => setCameraPreset("isometric")}
          />
          <WorkshopFooterButton
            action="front"
            label="Front view"
            active={cameraPreset === "front"}
            onClick={() => setCameraPreset("front")}
          />
          <WorkshopFooterButton action="reset" label="Reset camera" onClick={resetCamera} />
        </div>

        <div className="blacksmith-workshop-footer__primary">
          <span className="blacksmith-workshop-footer__divider" aria-hidden="true" />
          <WorkshopFooterButton
            action="test"
            label={testTypingMode ? "Exit test typing" : "Test typing"}
            active={testTypingMode}
            emphasized
            onClick={() => setTestTypingMode(!testTypingMode)}
          />
          <span className="blacksmith-workshop-footer__divider" aria-hidden="true" />
        </div>

        <div className="blacksmith-workshop-footer__group blacksmith-workshop-footer__group--history">
          <WorkshopFooterButton action="undo" label="Undo" disabled={!canUndo} onClick={undo} />
          <WorkshopFooterButton action="redo" label="Redo" disabled={!canRedo} onClick={redo} />
        </div>
      </div>

      <div className="blacksmith-workshop-footer__utility" aria-label="Build actions">
        <WorkshopFooterUtilityButton
          action="save"
          label={saved ? "Build saved" : "Save build"}
          active={saved}
          onClick={handleSave}
        />
        <div ref={moreButtonWrapRef} className="blacksmith-workshop-footer__more-wrap">
          <WorkshopFooterUtilityButton
            action="more"
            label="More build actions"
            active={showMore}
            onClick={() => setShowMore((visible) => !visible)}
          />
          {showMore &&
            createPortal(
              <div
                className="blacksmith-workshop-footer__more-menu"
                role="menu"
                aria-label="More build actions"
                style={moreMenuPosition}
              >
                <button type="button" role="menuitem" onClick={handleEquip}>
                  Equip keyboard
                </button>
                <button type="button" role="menuitem" onClick={handleExport}>
                  Export JSON
                </button>
              </div>,
              document.body,
            )}
        </div>
        <WorkshopFooterUtilityButton
          action="delete"
          label="Delete current build"
          onClick={handleDelete}
        />
      </div>
    </footer>
  );
}

function LegacyWorkshopToolbar() {
  const {
    undo,
    redo,
    history,
    historyIndex,
    testTypingMode,
    setTestTypingMode,
    cameraPreset,
    setCameraPreset,
  } = useWorkshopStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <footer
      className="flex items-center gap-2 px-3 py-2 border-t flex-wrap"
      style={{ background: "#2a1e12", borderColor: "#5a3a20" }}
      role="toolbar"
      aria-label="Workshop actions"
    >
      <div className="flex items-center gap-1 mr-2">
        <Camera size={13} className="opacity-60" style={{ color: "#c8a870" }} />
        <select
          value={cameraPreset}
          onChange={(event) => setCameraPreset(event.target.value as CameraPreset)}
          className="rounded px-2 py-1 text-xs outline-none"
          style={{ background: "#3a2a14", color: "#e8d5a0", border: "1px solid #5a3a20" }}
          aria-label="Camera view"
        >
          {CAMERA_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label} view
            </option>
          ))}
        </select>
        <button
          onClick={() => setCameraPreset("isometric")}
          className="px-2 py-1 rounded text-xs"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          title="Reset camera"
        >
          Reset view
        </button>
      </div>

      <div className="h-5 w-px" style={{ background: "#5a3a20" }} />

      <button
        onClick={() => setTestTypingMode(!testTypingMode)}
        className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all"
        style={{
          background: testTypingMode ? "#204a30" : "#3a2a14",
          color: testTypingMode ? "#80e0a0" : "#c8a870",
        }}
        aria-pressed={testTypingMode}
      >
        <Keyboard size={13} />
        Test Typing
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all disabled:opacity-40"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          aria-label="Undo"
          title="Undo"
        >
          <RotateCcw size={13} />
          <span className="hidden sm:inline">Undo</span>
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs transition-all disabled:opacity-40"
          style={{ background: "#3a2a14", color: "#c8a870" }}
          aria-label="Redo"
          title="Redo"
        >
          <RotateCw size={13} />
          <span className="hidden sm:inline">Redo</span>
        </button>
      </div>
    </footer>
  );
}

export function WorkshopToolbar({ ornate = false }: { ornate?: boolean }) {
  return ornate ? <BlacksmithWorkshopFooter /> : <LegacyWorkshopToolbar />;
}
