import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

interface InteractiveAvatarProps {
  src: string;
  alt: string;
  /** Element whose bounding box the mouse-follow parallax is measured against. */
  trackRef: RefObject<HTMLElement | null>;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function InteractiveAvatar({ src, alt, trackRef, className }: InteractiveAvatarProps) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const shell = shellRef.current;
    if (!track || !shell) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let blinkCleanup: ReturnType<typeof setTimeout>;

    function render() {
      currentX += (targetX - currentX) * 0.09;
      currentY += (targetY - currentY) * 0.09;
      shell!.style.setProperty('--mx', currentX.toFixed(4));
      shell!.style.setProperty('--my', currentY.toFixed(4));
      rafId = requestAnimationFrame(render);
    }

    function onPointerMove(event: PointerEvent) {
      const rect = track!.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      targetX = clamp((x - 0.5) * 2, -1, 1);
      targetY = clamp((y - 0.5) * 2, -1, 1);
    }

    function onPointerLeave() {
      targetX = 0;
      targetY = 0;
    }

    function blink() {
      shell!.classList.remove('ia-blinking');
      void shell!.offsetWidth;
      shell!.classList.add('ia-blinking');

      clearTimeout(blinkCleanup);
      blinkCleanup = setTimeout(() => {
        shell!.classList.remove('ia-blinking');
      }, 420);

      const nextBlink = 2200 + Math.random() * 4200;
      blinkTimer = setTimeout(blink, nextBlink);
    }

    function react() {
      shell!.classList.remove('ia-clicked');
      void shell!.offsetWidth;
      shell!.classList.add('ia-clicked');
      setTimeout(() => shell!.classList.remove('ia-clicked'), 430);
    }

    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerleave', onPointerLeave);
    shell.addEventListener('pointerdown', react);

    if (!reduceMotion) {
      rafId = requestAnimationFrame(render);
      blinkTimer = setTimeout(blink, 1200 + Math.random() * 1400);
    }

    return () => {
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerleave', onPointerLeave);
      shell.removeEventListener('pointerdown', react);
      cancelAnimationFrame(rafId);
      clearTimeout(blinkTimer);
      clearTimeout(blinkCleanup);
    };
  }, [trackRef]);

  return (
    <div className={`ia-avatar-shell ${className ?? ''}`} ref={shellRef}>
      <div className="ia-avatar-float">
        <div className="ia-avatar-tilt">
          <img className="ia-avatar-img" src={src} alt={alt} draggable={false} />
          <div className="ia-shine" aria-hidden="true" />
          <div className="ia-blink ia-blink-left" aria-hidden="true" />
          <div className="ia-blink ia-blink-right" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
