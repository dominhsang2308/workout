/**
 * Web Audio API & Haptics alert utility for workout rest timers.
 * 100% self-contained, offline-compatible, no external audio files required.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const audioAlerts = {
  isSoundEnabled(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("workout_timer_sound") !== "false";
  },

  setSoundEnabled(enabled: boolean) {
    if (typeof window === "undefined") return;
    localStorage.setItem("workout_timer_sound", enabled ? "true" : "false");
  },

  isVibrationEnabled(): boolean {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("workout_timer_vibration") !== "false";
  },

  setVibrationEnabled(enabled: boolean) {
    if (typeof window === "undefined") return;
    localStorage.setItem("workout_timer_vibration", enabled ? "true" : "false");
  },

  /**
   * Plays a short warning pip for countdown ticks (3, 2, 1)
   */
  playCountdownBeep(freq = 520, duration = 0.09) {
    if (!this.isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);

      this.triggerHaptic(60);
    } catch (e) {
      console.warn("Could not play countdown beep", e);
    }
  },

  /**
   * Plays an energetic, uplifting 3-note chord when rest timer completes
   */
  playFinishChime() {
    if (this.isSoundEnabled()) {
      try {
        const ctx = getAudioContext();
        if (ctx) {
          const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
          const noteDuration = 0.18;

          notes.forEach((freq, idx) => {
            const startTime = ctx.currentTime + idx * 0.08;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.22, startTime);
            gain.gain.exponentialRampToValueAtTime(
              0.001,
              startTime + noteDuration + 0.15
            );

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + noteDuration + 0.2);
          });
        }
      } catch (e) {
        console.warn("Could not play finish chime", e);
      }
    }

    // Double vibration pulse for physical notification
    this.triggerHaptic([120, 80, 220]);
  },

  /**
   * Plays a crisp sound when timer is started or extended
   */
  playStartTone() {
    if (!this.isSoundEnabled()) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);

      this.triggerHaptic(40);
    } catch (e) {
      console.warn("Could not play start tone", e);
    }
  },

  triggerHaptic(pattern: number | number[] = 100) {
    if (!this.isVibrationEnabled()) return;
    try {
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // Vibration not supported or blocked
    }
  },
};
