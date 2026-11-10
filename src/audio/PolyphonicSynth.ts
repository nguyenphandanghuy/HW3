export class PolyphonicSynth {
  private ctx: AudioContext | null = null;
  private maxVoices: number;
  private voices: Map<number, { osc: OscillatorNode; gain: GainNode }>;

  constructor(maxVoices = 8) {
    this.maxVoices = maxVoices;
    this.voices = new Map();
  }

  noteOn(midi: number, freqHz: number) {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (this.voices.has(midi)) return;

    // FIFO Voice Stealing: Nếu vượt quá 8 âm thanh cùng lúc thì xóa âm cũ nhất
    if (this.voices.size >= this.maxVoices) {
      const oldestMidi = this.voices.keys().next().value;
      if (oldestMidi !== undefined) {
        this.noteOff(oldestMidi);
      }
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(freqHz, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();

    this.voices.set(midi, { osc, gain });
  }

  noteOff(midi: number) {
    const voice = this.voices.get(midi);
    if (voice && this.ctx) {
      // Giảm âm lượng từ từ tránh tiếng nổ audio (pop noise)
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);
      setTimeout(() => {
        voice.osc.stop();
        voice.osc.disconnect();
      }, 50);
      this.voices.delete(midi);
    }
  }
}