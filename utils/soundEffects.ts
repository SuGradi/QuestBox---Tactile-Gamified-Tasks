// Web Audio API Synth for Gamified UI Sounds

let audioCtx: AudioContext | null = null;

const getCtx = () => {
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx!;
};

const resumeCtx = () => {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
};

type SoundType = 'click' | 'pop' | 'success' | 'delete' | 'xp' | 'levelUp' | 'magic';

export const playSound = (type: SoundType) => {
  try {
    const ctx = resumeCtx();
    const now = ctx.currentTime;
    
    // Master gain for volume control per sound type
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);

    switch (type) {
      case 'click': {
        // Short, tactile "thock"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'pop': {
        // Bubble pop sound (frequency sweep up)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case 'success': {
        // Ascending major arpeggio (C - E - G)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(masterGain);

          const startTime = now + i * 0.05;
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

          osc.start(startTime);
          osc.stop(startTime + 0.4);
        });
        break;
      }

      case 'xp': {
        // High pitched "bling"
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.15);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }

      case 'delete': {
        // Descending noise-like sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      case 'levelUp': {
        // Fanfare sequence
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(masterGain);

          const startTime = now + i * 0.1;
          const duration = i === notes.length - 1 ? 0.8 : 0.3;

          osc.type = 'triangle';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
        break;
      }

      case 'magic': {
        // Mystical shimmer
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        osc.type = 'sine';
        // Fast vibrato
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 15; // 15Hz vibrato
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 500;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + 1.5);

        osc.frequency.setValueAtTime(600, now);
        osc.frequency.linearRampToValueAtTime(1200, now + 1);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

        osc.start(now);
        osc.stop(now + 1.5);
        break;
      }
    }
  } catch (e) {
    // Audio context might be blocked or not supported
    console.error('Audio play failed', e);
  }
};