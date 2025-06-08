'use client'
import React, { useEffect, useRef, useState } from 'react'
import LoginForm from './login/Login'
import RegisterForm from './register/RegisterForm'
import gsap from 'gsap'

function Auth() {

  const containerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (!containerRef.current) return
    const width = window.innerWidth
    let xValue = 0
    if (width >= 768) {
      xValue = index === 0 ? 0 : -width / 2
    } else {
      xValue = index === 0 ? 0 : -width
    }

    gsap.to(containerRef.current, {
      x: xValue,
      duration: 1,
      ease: 'power2.inOut',
    })
  }, [index])

  return (
    <>
      <div className="w-[100vw] h-[100vh] overflow-hidden fixed top-[0] right-[0] z-[40] bg-[white]">
        <div ref={containerRef} className={`w-[200vw] md:w-[100vw] h-[100vh] relative left-0 md:left-[50%] flex  bg-[url('/images/loginscreen.jpeg')] bg-contain bg-no-repeat bg-center`}>
          <LoginForm setIndex={setIndex} />
          <RegisterForm setIndex={setIndex} />
        </div>
      </div>
    </>
  )
}

export default Auth
