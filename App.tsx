
import React, { useState, useCallback } from 'react';
import Wheel from './components/Wheel';
import Confetti from './components/Confetti';
import { TASKS } from './constants';
import type { Task } from './types';

const App: React.FC = () => {
  const [spinning, setSpinning] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const handleSpin = useCallback(() => {
    if (spinning) return;

    setSpinning(true);
    setSelectedTask(null);
    setShowConfetti(false);

    const winnerIndex = Math.floor(Math.random() * TASKS.length);
    const segmentAngle = 360 / TASKS.length;
    
    // Calculate target angle to land the winner at the top (12 o'clock position)
    // Add random offset to not always land in the center of the segment
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
    const targetAngle = 360 - (winnerIndex * segmentAngle) - randomOffset;

    // Add multiple full spins for visual effect
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const finalRotation = rotation + (fullSpins * 360) + targetAngle;

    setRotation(finalRotation);

    const spinDuration = 6000; // This should match the CSS transition duration in Wheel.tsx

    setTimeout(() => {
      setSpinning(false);
      setSelectedTask(TASKS[winnerIndex]);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts for 5 seconds
    }, spinDuration);
  }, [spinning, rotation]);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {showConfetti && <Confetti />}
      <header className="absolute top-0 left-0 right-0 p-4 sm:p-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold neon-text tracking-wider">
          КОЛЕСО УДАЧИ
        </h1>
      </header>
      
      <main className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto mt-20 sm:mt-24 lg:mt-0 lg:flex-row lg:justify-around">
        <div className="relative flex-shrink-0">
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 z-10 w-0 h-0 
            border-l-[15px] border-l-transparent
            border-r-[15px] border-r-transparent
            border-t-[30px] border-t-cyan-400"
            style={{ filter: 'drop-shadow(0 0 10px #0ff)' }}
          ></div>
          <Wheel tasks={TASKS} rotation={rotation} />
        </div>
        
        <div className="flex flex-col items-center mt-8 lg:mt-0 lg:w-1/3 text-center">
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl font-bold rounded-lg border-2 border-cyan-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 neon-button-shadow"
          >
            {spinning ? 'ВРАЩЕНИЕ...' : 'ЗАПУСТИТЬ'}
          </button>
          
          <div className="mt-8 p-6 w-full max-w-md h-48 bg-black bg-opacity-30 border-2 border-fuchsia-500 rounded-lg shadow-[0_0_15px_#f0f] flex items-center justify-center">
            {selectedTask ? (
              <p className="text-xl md:text-2xl font-semibold text-fuchsia-300 animate-pulse" style={{ textShadow: '0 0 8px #f0f' }}>
                {selectedTask.text}
              </p>
            ) : (
              <p className="text-gray-400 text-lg">
                {spinning ? 'Определение задания...' : 'Нажмите "Запустить", чтобы начать'}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
