'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Loader: React.FC = () => {
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (lettersRef.current.length) {
      gsap.to(lettersRef.current, {
        y: -10,
        repeat: -1,
        yoyo: true,
        stagger: 0.1,
        ease: 'power1.inOut',
        duration: 0.6,
      });
    }
  }, []);

  const word = 'EventHub';

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-[1000]">
      <div className="w-40 h-40 rounded-full bg-white bg-opacity-80 shadow-xl flex items-center justify-center">
        {word.split('').map((char, index) => (
          <span
            key={index}
            ref={(el) => {
              if (el) lettersRef.current[index] = el;
            }}
            className="text-gray-800 font-bold text-xl mx-[1px]"
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Loader;
