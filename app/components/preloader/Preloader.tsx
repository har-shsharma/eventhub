'use client'
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

function Preloader() {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.to(textRef.current, {
            y: 0,
            opacity: 1,
            duration: 1,
        })
        .to(containerRef.current, {
            width:window.innerWidth < 768? '' : '50vw',
            height:window.innerWidth < 768? '0vh' : '',
            duration: 1,
            delay: 1,
            ease: 'power2.inOut',
        })
    }, []);

    return (
        <div ref={containerRef} className="fixed top-0 left-0 w-full h-full bg-black z-50 overflow-hidden flex justify-center items-center">
            <h2 ref={textRef} className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                EventHub
            </h2>
        </div>
    );
}

export default Preloader;
