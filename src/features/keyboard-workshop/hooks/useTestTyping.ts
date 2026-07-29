"use client"
import { useEffect } from "react"
import { useWorkshopStore } from "../store"

// Maps KeyboardEvent.code → key ID used in the layout
const CODE_TO_ID: Record<string, string> = {
  Escape: "Escape",
  F1: "F1", F2: "F2", F3: "F3", F4: "F4",
  F5: "F5", F6: "F6", F7: "F7", F8: "F8",
  F9: "F9", F10: "F10", F11: "F11", F12: "F12",
  Delete: "Delete",
  Backquote: "Backtick",
  Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4",
  Digit5: "5", Digit6: "6", Digit7: "7", Digit8: "8",
  Digit9: "9", Digit0: "0",
  Minus: "Minus", Equal: "Equal",
  Backspace: "Backspace",
  Tab: "Tab",
  KeyQ: "Q", KeyW: "W", KeyE: "E", KeyR: "R", KeyT: "T",
  KeyY: "Y", KeyU: "U", KeyI: "I", KeyO: "O", KeyP: "P",
  BracketLeft: "BracketL", BracketRight: "BracketR",
  Backslash: "Backslash", PageUp: "PageUp",
  CapsLock: "CapsLock",
  KeyA: "A", KeyS: "S", KeyD: "D", KeyF: "F", KeyG: "G",
  KeyH: "H", KeyJ: "J", KeyK: "K", KeyL: "L",
  Semicolon: "Semicolon", Quote: "Quote",
  Enter: "Enter", PageDown: "PageDown",
  ShiftLeft: "ShiftL", ShiftRight: "ShiftR",
  KeyZ: "Z", KeyX: "X", KeyC: "C", KeyV: "V", KeyB: "B",
  KeyN: "N", KeyM: "M",
  Comma: "Comma", Period: "Period", Slash: "Slash",
  ArrowUp: "ArrowUp", End: "End",
  ControlLeft: "CtrlL", ControlRight: "CtrlR",
  MetaLeft: "Win", MetaRight: "Win",
  AltLeft: "AltL",
  Space: "Space",
  ArrowLeft: "ArrowLeft", ArrowDown: "ArrowDown", ArrowRight: "ArrowRight",
}

export function useTestTyping() {
  const { testTypingMode, setPressedKey } = useWorkshopStore()

  useEffect(() => {
    if (!testTypingMode) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.nativeEvent?.isComposing || e.keyCode === 229) return
      const keyId = CODE_TO_ID[e.code]
      if (keyId) setPressedKey(keyId, true)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyId = CODE_TO_ID[e.code]
      if (keyId) setPressedKey(keyId, false)
    }

    // Cast to work without nativeEvent (native DOM events)
    const down = (e: Event) => {
      const ke = e as KeyboardEvent
      const keyId = CODE_TO_ID[ke.code]
      if (keyId) setPressedKey(keyId, true)
    }
    const up = (e: Event) => {
      const ke = e as KeyboardEvent
      const keyId = CODE_TO_ID[ke.code]
      if (keyId) setPressedKey(keyId, false)
    }

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [testTypingMode, setPressedKey])
}
