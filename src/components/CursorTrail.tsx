import React, { useEffect, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

const CursorTrail: React.FC = () => {
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const trailLength = 8;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastTime > 50) { // Throttle to every 50ms
        setTrail(prevTrail => {
          const newPoint = { x: e.clientX, y: e.clientY, id: now };
          const newTrail = [newPoint, ...prevTrail.slice(0, trailLength - 1)];
          return newTrail;
        });
        lastTime = now;
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <>
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="cursor-trail"
          style={{
            left: point.x - 10,
            top: point.y - 10,
            opacity: (trail.length - index) / trail.length * 0.6,
            transform: `scale(${(trail.length - index) / trail.length})`,
            animationDelay: `${index * 0.05}s`,
          }}
        />
      ))}
    </>
  );
};

export default CursorTrail;