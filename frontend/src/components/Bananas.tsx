import { useEffect, useRef, useState } from 'react'

type Banana = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  scale: number
  rotation: number
}

function Bananas() {

  const [bananas, setBananas] = useState<Banana[]>([]);
  const lastFrameTimeRef = useRef<number | null>(null);

  function spawnBanana() {
    setBananas((currentBananas) => currentBananas.length > 100 ? currentBananas.slice(1) : currentBananas);
    const newBanana = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 200) + 50,
      y: -200,
      vx: 0,
      vy: Math.random() * 40,
      scale: Math.random() * 0.5 + 1.2,
      rotation: Math.random() * 360,
    };
    setBananas((currentBananas) => [...currentBananas, newBanana]);
  }

  function onMount() {
    const interval = setInterval(spawnBanana, 3000);
    return () => clearInterval(interval);
  }

  useEffect(onMount, []);

  useEffect(() => {
    const gravity = 600;
    const wallBounce = 0.45;
    const floorFriction = 0.08;
    const bananaBounce = 0.2;
    const bananaSize = 42;

    let animationFrameId = 0;

    function resolveBananaCollisions(nextBananas: Banana[]) {
      for (let i = 0; i < nextBananas.length; i += 1) {
        for (let j = i + 1; j < nextBananas.length; j += 1) {
          const first = nextBananas[i];
          const second = nextBananas[j];
          const radiusA = (bananaSize * first.scale) / 2;
          const radiusB = (bananaSize * second.scale) / 2;
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distance = Math.hypot(dx, dy);
          const minDistance = radiusA + radiusB;

          if (distance === 0 || distance >= minDistance) {
            continue;
          }

          const nx = dx / distance;
          const ny = dy / distance;
          const overlap = minDistance - distance;

          first.x -= (overlap * nx) / 2;
          first.y -= (overlap * ny) / 2;
          second.x += (overlap * nx) / 2;
          second.y += (overlap * ny) / 2;

          const relativeVelocityX = second.vx - first.vx;
          const relativeVelocityY = second.vy - first.vy;
          const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

          if (velocityAlongNormal >= 0) {
            continue;
          }

          const impulse = (-(1 + bananaBounce) * velocityAlongNormal) / 2;
          first.vx -= impulse * nx;
          first.vy -= impulse * ny;
          second.vx += impulse * nx;
          second.vy += impulse * ny;
        }
      }

      return nextBananas;
    }

    function animateFrame(timestamp: number) {
      const previousTimestamp = lastFrameTimeRef.current ?? timestamp;
      const deltaTime = Math.min((timestamp - previousTimestamp) / 1000, 0.03);
      lastFrameTimeRef.current = timestamp;

      setBananas((currentBananas) => {
        const nextBananas = currentBananas.map((banana) => {
          let nextX = banana.x + banana.vx * deltaTime;
          let nextY = banana.y + banana.vy * deltaTime;
          let nextVx = banana.vx;
          let nextVy = banana.vy + gravity * deltaTime;
          const radius = (bananaSize * banana.scale) / 2;

          if (nextX - radius < 0) {
            nextX = radius;
            nextVx = Math.abs(nextVx) * wallBounce;
          } else if (nextX + radius > window.innerWidth) {
            nextX = window.innerWidth - radius;
            nextVx = -Math.abs(nextVx) * wallBounce;
          }

          if (nextY - radius < 0) {
            nextY = radius;
            nextVy = Math.abs(nextVy) * wallBounce;
          } else if (nextY + radius > window.innerHeight - 60) {
            nextY = window.innerHeight - 60 - radius;
            nextVy = -Math.abs(nextVy) * wallBounce;
            nextVx *= floorFriction;

            if (Math.abs(nextVy) < 35) {
              nextVy = 0;
            }
          }

          return {
            ...banana,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
          };
        });

        return resolveBananaCollisions(nextBananas);
      });

      animationFrameId = window.requestAnimationFrame(animateFrame);
    }

    animationFrameId = window.requestAnimationFrame(animateFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      lastFrameTimeRef.current = null;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key.toUpperCase();
      if (key === 'B') {
        spawnBanana();
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="bananas">
      {bananas.map((banana) => (
        <img
          key={banana.id}
          src="/banana.png"
          alt="Banana"
          className="banana"
          style={{
            '--x': `${banana.x}px`,
            '--y': `${banana.y}px`,
            '--banana-scale': banana.scale,
            '--banana-rotation': `${banana.rotation}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

export default Bananas
