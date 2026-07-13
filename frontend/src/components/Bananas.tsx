import { useEffect, useState } from 'react'

type Banana = {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
}

function Bananas() {

  const [bananas, setBananas] = useState<Banana[]>([]);

  function spawnBanana() {
    setBananas((currentBananas) => currentBananas.length > 100 ? currentBananas.slice(1) : currentBananas);
    const newBanana = {
      id: Date.now(),
      x: Math.random() * (window.innerWidth - 200) + 50,
      y: -100,
      scale: Math.random() * 0.3 + 0.6,
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
