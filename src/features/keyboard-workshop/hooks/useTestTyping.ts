"use client"
import { useEffect } from "react"
import { useWorkshopStore, useWorkshopTypingStore } from "../store"
import type { SoundCustomization } from "../types"

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
  const testTypingMode = useWorkshopStore((state) => state.testTypingMode)
  const sound = useWorkshopStore((state) => state.currentBuild.sound)

  useEffect(() => {
    if (!testTypingMode) return

    const heldKeys = new Set<string>()
    const { setPressedKey, clearPressedKeys } =
      useWorkshopTypingStore.getState()

    const down = (event: KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229) return
      const keyId = CODE_TO_ID[event.code]
      if (!keyId) return
      event.preventDefault()
      if (event.repeat || heldKeys.has(keyId)) return
      heldKeys.add(keyId)
      setPressedKey(keyId, true)
      playKeySound(sound, keyId)
    }
    const up = (event: KeyboardEvent) => {
      const keyId = CODE_TO_ID[event.code]
      if (!keyId) return
      event.preventDefault()
      heldKeys.delete(keyId)
      setPressedKey(keyId, false)
    }
    const releaseAll = () => {
      heldKeys.clear()
      clearPressedKeys()
    }

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    window.addEventListener("blur", releaseAll)

    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
      window.removeEventListener("blur", releaseAll)
      releaseAll()
    }
  }, [sound, testTypingMode])
}

const SOUND_PROFILES: Record<string, [OscillatorType, number]> = {
  soft: ["sine", 150],
  creamy: ["sine", 120],
  thock: ["triangle", 92],
  clack: ["square", 180],
  silent: ["sine", 70],
  wood: ["triangle", 105],
  ceramic: ["square", 220],
  crystal: ["sine", 320],
  stone: ["triangle", 78],
  retro: ["square", 135],
  magical: ["sine", 260],
}

let sharedAudioContext: AudioContext | null = null

function getAudioContext() {
  const Context = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Context) return null
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    sharedAudioContext = new Context({ latencyHint: "interactive" })
  }
  if (sharedAudioContext.state === "suspended") {
    void sharedAudioContext.resume()
  }
  return sharedAudioContext
}

function playKeySound(sound: SoundCustomization, keyId: string) {
  if (sound.volume <= 0) return
  const context = getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const [type, frequency] =
    SOUND_PROFILES[sound.profile] ?? SOUND_PROFILES.thock
  const now = context.currentTime

  oscillator.type = type
  oscillator.frequency.value =
    (frequency +
      ((keyId.charCodeAt(0) || 0) % 7 - 3) *
        sound.pitchVariation *
        18) *
    sound.pitch
  gain.gain.setValueAtTime(Math.min(0.16, sound.volume * 0.16), now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.075)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.08)
  oscillator.addEventListener("ended", () => {
    oscillator.disconnect()
    gain.disconnect()
  })
}
