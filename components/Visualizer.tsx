
import React, { useRef, useEffect } from 'react';

const Visualizer: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bars = 40;
    const barWidth = canvas.width / bars;
    const data = Array(bars).fill(0).map(() => Math.random());

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < bars; i++) {
        // Smooth random heights for mock visualizer
        if (isActive) {
          data[i] += (Math.random() - 0.5) * 0.2;
          data[i] = Math.max(0.1, Math.min(1, data[i]));
        } else {
          data[i] *= 0.9;
        }

        const h = data[i] * canvas.height * 0.8;
        const x = i * barWidth;
        const y = canvas.height - h;

        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
        gradient.addColorStop(0, '#00ffff');
        gradient.addColorStop(1, '#ff00ff');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, h);
        
        // Add a slight glow top
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + 1, y, barWidth - 2, 2);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  return <canvas ref={canvasRef} className="w-full h-full" width={400} height={100} />;
};

export default Visualizer;
