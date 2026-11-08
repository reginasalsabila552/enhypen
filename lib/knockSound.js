export function knockSound() {
  try {
    const ac = knockSound.ac || (knockSound.ac = new (window.AudioContext || window.webkitAudioContext)());
    if (ac.state === "suspended") ac.resume();
    const t0 = ac.currentTime;
    [0, 0.28, 0.56].forEach((dt) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(170, t0 + dt);
      o.frequency.exponentialRampToValueAtTime(55, t0 + dt + 0.12);
      g.gain.setValueAtTime(0.0001, t0 + dt);
      g.gain.exponentialRampToValueAtTime(0.55, t0 + dt + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + 0.17);
      o.connect(g).connect(ac.destination);
      o.start(t0 + dt); o.stop(t0 + dt + 0.2);
    });
  } catch (e) {}
}
