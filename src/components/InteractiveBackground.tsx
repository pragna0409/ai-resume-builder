import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

const InteractiveBackground: React.FC = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const colors = [
      'bg-blue-500/20',
      'bg-purple-500/20',
      'bg-indigo-500/20',
      'bg-pink-500/20',
      'bg-cyan-500/20',
    ];

    const initialShapes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 10,
    }));

    setShapes(initialShapes);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full ${shape.color} blur-xl`}
          style={{
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            x: [shape.x, shape.x + 100, shape.x - 100, shape.x],
            y: [shape.y, shape.y - 100, shape.y + 100, shape.y],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Interactive gradient that follows mouse */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-3xl"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 200,
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default InteractiveBackground;