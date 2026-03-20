// Web Audio API — no npm deps needed
// iOS Safari: AudioContext must be created + resumed inside a user gesture handler
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtx = new Ctor();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

export function unlockAudio(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  // Play a silent buffer to fully unlock on iOS
  try {
    const buf = ctx.createBuffer(1, 1, 22050);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(0);
  } catch {
    // ignore
  }
}

function beep(
  frequency: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.14
): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") return; // not unlocked yet, skip

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // ignore
  }
}

export function playEat(): void {
  beep(520, 0.07, "square", 0.13);
}

export function playMilestone(): void {
  // Ascending 4-note fanfare — schedule via AudioContext time, not setTimeout
  const ctx = getCtx();
  if (!ctx || ctx.state === "suspended") return;
  const notes = [523, 659, 784, 1047];
  const step = 0.09;
  notes.forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * step);
      gain.gain.setValueAtTime(0.14, ctx.currentTime + i * step);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * step + 0.12
      );
      osc.start(ctx.currentTime + i * step);
      osc.stop(ctx.currentTime + i * step + 0.12);
    } catch {
      // ignore
    }
  });
}

export function playGameOver(): void {
  const ctx = getCtx();
  if (!ctx || ctx.state === "suspended") return;
  const notes = [330, 277, 247, 220];
  const step = 0.11;
  notes.forEach((freq, i) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * step);
      gain.gain.setValueAtTime(0.12, ctx.currentTime + i * step);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * step + 0.18
      );
      osc.start(ctx.currentTime + i * step);
      osc.stop(ctx.currentTime + i * step + 0.18);
    } catch {
      // ignore
    }
  });
}
