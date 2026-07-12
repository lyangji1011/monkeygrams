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

  useEffect(() => {
    console.log(bananas);
  }, [bananas]);
  
  function spawnBanana() {
    const newBanana = {
      id: Date.now(),
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 100,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    };
    setBananas((currentBananas) => [...currentBananas, newBanana]);
  }

  function onMount() {
    const interval = setInterval(spawnBanana, 3000);
    return () => clearInterval(interval);
  }

  useEffect(onMount, []);


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
