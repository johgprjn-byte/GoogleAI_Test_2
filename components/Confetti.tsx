
import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  rotation: number;
  spin: number;
}

const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#00ffff', '#ff00ff', '#ff3366', '#ffff00', '#ffffff'];
    const particleCount = 300;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 2;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 10 + 5,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 4, // Initial upward burst
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 10
      });
    }
    
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.speedY += 0.1; // Gravity
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity -= 0.005;
        p.rotation += p.spin;

        if (p.opacity <= 0) {
          particles.splice(index, 1);
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 2); // Rectangular confetti
        ctx.restore();
      });

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    const handleResize = () => {
        if(canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default Confetti;
