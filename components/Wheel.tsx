
import React from 'react';
import type { Task } from '../types';

interface WheelProps {
  tasks: Task[];
  rotation: number;
}

const Wheel: React.FC<WheelProps> = ({ tasks, rotation }) => {
  const numSegments = tasks.length;
  const angle = 360 / numSegments;
  const radius = 250;
  const center = 260;
  const colors = ['#00ffff', '#ff00ff', '#ff3366']; // Cyan, Magenta, Pink-Red

  const getCoordinatesForPercent = (percent: number) => {
    const x = center + radius * Math.cos(2 * Math.PI * percent);
    const y = center + radius * Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const segments = tasks.map((task, i) => {
    const startAngle = i * angle;
    const endAngle = (i + 1) * angle;

    const [startX, startY] = getCoordinatesForPercent(startAngle / 360);
    const [endX, endY] = getCoordinatesForPercent(endAngle / 360);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${center},${center}`,
      `L ${startX},${startY}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`,
      'Z'
    ].join(' ');

    const textAngle = startAngle + angle / 2;
    const textRadius = radius * 0.8;
    const textX = center + textRadius * Math.cos(2 * Math.PI * textAngle / 360);
    const textY = center + textRadius * Math.sin(2 * Math.PI * textAngle / 360);

    return (
      <g key={task.id}>
        <path d={pathData} fill={colors[i % colors.length]} stroke="#fff" strokeWidth="2" />
        <text
          x={textX}
          y={textY}
          transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
          textAnchor="middle"
          alignmentBaseline="central"
          fill="white"
          fontSize="24"
          className="seven-segment"
          style={{ textShadow: '0 0 5px black' }}
        >
          {task.id}
        </text>
      </g>
    );
  });

  return (
    <div className="w-[32rem] h-[32rem] flex items-center justify-center" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,255,0.5))' }}>
      <div
        className="relative w-full h-full rounded-full"
        style={{
          transition: 'transform 6000ms cubic-bezier(0.1, 0.7, 0.3, 1)',
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg viewBox="0 0 520 520" className="w-full h-full">
          {segments}
          <circle cx={center} cy={center} r={radius * 0.2} fill="url(#metal)" stroke="#fff" strokeWidth="4" />
          <defs>
            <radialGradient id="metal" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: '#bbbbbb', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#555555', stopOpacity: 1 }} />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default Wheel;
