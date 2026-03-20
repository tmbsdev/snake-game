// Web Audio API — no dependencies, works everywhere
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function beep(frequency: number, duration: number, type: OscillatorType = "square", volume = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

// Normal eat: short bip
export function playEat() {
  beep(440, 0.08, "square", 0.12);
}

// Milestone (10x): atari fanfare
export function playMilestone() {
  const ctx = getCtx();
  if (!ctx) return;

  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.12, "square", 0.15), i * 80);
  });
}

// Game over
export function playGameOver() {
  const ctx = getCtx();
  if (!ctx) return;

  const notes = [330, 277, 247, 220];
  notes.forEach((freq, i) => {
    setTimeout(() => beep(freq, 0.18, "sawtooth", 0.12), i * 100);
  });
}
