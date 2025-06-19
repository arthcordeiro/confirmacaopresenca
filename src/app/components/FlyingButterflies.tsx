'use client';
import Image from 'next/image'
import { useEffect, useState } from 'react';

type Butterfly = {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
};

interface FlyingButterfliesProps {
  imageSrc: string; // Caminho do GIF
  quantity?: number; // Quantidade de borboletas
}

export default function FlyingButterflies({ imageSrc, quantity = 10 }: FlyingButterfliesProps) {
  const [butterflies, setButterflies] = useState<Butterfly[]>([]);

  useEffect(() => {
    // Inicializa as borboletas
    const initialButterflies = Array.from({ length: quantity }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: (Math.random() - 0.5) * 1.5, // velocidade horizontal
      speedY: (Math.random() - 0.5) * 1.5, // velocidade vertical
    }));
    setButterflies(initialButterflies);
  }, [quantity]);

  useEffect(() => {
    const move = () => {
      setButterflies((prev) =>
        prev.map((b) => {
          let newX = b.x + b.speedX;
          let newY = b.y + b.speedY;

          // Faz retornar quando chega na borda
          if (newX < 0 || newX > window.innerWidth) {
            newX = Math.max(0, Math.min(newX, window.innerWidth));
            b.speedX *= -1;
          }
          if (newY < 0 || newY > window.innerHeight) {
            newY = Math.max(0, Math.min(newY, window.innerHeight));
            b.speedY *= -1;
          }

          return { ...b, x: newX, y: newY };
        })
      );
    };

    const interval = setInterval(move, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {butterflies.map((b) => (
        <Image
          key={b.id}
          src={imageSrc}
          alt="butterfly"
          className="absolute"
          width={50}
          height={50}
          style={{
            left: b.x,
            top: b.y,
            transform: `translate(-50%, -50%)`,
          }}
        />
      ))}
    </div>
  );
}
