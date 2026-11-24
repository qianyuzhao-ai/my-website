// 零外部音频文件的《塞尔达》风五声音阶空灵合成器（Web Audio API）。
// 仅在用户主动交互且未静音时发声，温和空灵不刺耳。

class SkyAudioEngine {
  private ctx: AudioContext | null = null;
  public muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    delaySec: number,
    durationSec: number,
    gainPeak = 0.06,
    type: OscillatorType = "sine",
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec + 0.03);
  }

  /** 跳跃轻响 */
  playJump() {
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + 0.14);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  /** 开启石碑/神庙时的五声音阶双音风铃 */
  playShrineOpen() {
    this.playTone(587.33, 0, 0.55, 0.055, "sine"); // D5
    this.playTone(880.0, 0.09, 0.75, 0.05, "sine"); // A5
    this.playTone(1174.66, 0.18, 0.9, 0.035, "triangle"); // D6
  }

  /** 乘风弹射阵起飞空灵琶音 */
  playWindLaunch() {
    const notes = [440, 523.25, 659.25, 880, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, idx * 0.055, 0.65, 0.045, "sine");
    });
  }

  /** 卢比兔受惊逃跑时的星光闪烁音 */
  playBlupeeSparkle() {
    const notes = [1046.5, 1318.5, 1567.98, 2093.0];
    notes.forEach((n, idx) => {
      this.playTone(n, idx * 0.045, 0.32, 0.03, "sine");
    });
  }

  /** 左纳乌方块推入石槽时的塞尔达风解谜成功旋律！ */
  playPuzzleSolved() {
    const jingle = [
      { f: 523.25, t: 0.0, d: 0.28 },
      { f: 659.25, t: 0.13, d: 0.28 },
      { f: 783.99, t: 0.26, d: 0.28 },
      { f: 1046.5, t: 0.39, d: 0.42 },
      { f: 1318.51, t: 0.56, d: 1.05 },
    ];
    for (const note of jingle) {
      this.playTone(note.f, note.t, note.d, 0.065, "triangle");
    }
  }

  /** 篝火料理锅咕嘟香气音效 */
  playCookingChime() {
    this.playTone(523.25, 0, 0.35, 0.045, "sine");
    this.playTone(659.25, 0.08, 0.45, 0.045, "sine");
  }

  /** 左纳乌滑翔翼飞出音效 */
  playGliderLaunch() {
    this.playTone(493.88, 0, 0.5, 0.04, "sine");
    this.playTone(739.99, 0.08, 0.7, 0.045, "sine");
    this.playTone(987.77, 0.16, 0.85, 0.035, "sine");
  }
}

export const skyAudio = new SkyAudioEngine();
