/**
 * Generador de efectos de sonido sintetizados estilo Frutiger Aero (Crystal Chimes & Water Drops).
 * Basado en Web Audio API pura, armónicos cálidos y limpios sin archivos externos.
 */

class RetroAudio {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Toque de gota de agua / Cristal Aero
  playCoin() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Deslizamiento rápido de frecuencia simulando gota de agua cristalina
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1600, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Ignorar restricciones de audio del navegador
    }
  }

  // Acorde mayor brillante y cristalino (Aero Harmony)
  playVictory() {
    try {
      this.init();
      if (!this.ctx) return;
      // Tríada brillante de Do mayor con octava alta
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const now = this.ctx.currentTime + index * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.7);
      });
    } catch {
      // Ignorar si el audio no está disponible
    }
  }

  // Notificación suave de error / atención
  playError() {
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [360, 270].forEach((freq, idx) => {
        const startTime = now + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.28);
      });
    } catch {
      // Ignorar restricciones de audio
    }
  }
}

export const retroAudio = new RetroAudio();
