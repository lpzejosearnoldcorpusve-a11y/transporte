"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WelcomeAnimationProps {
  userName: string
  onComplete: () => void
}

export function WelcomeAnimation({ userName, onComplete }: WelcomeAnimationProps) {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animación de progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    const timer = setTimeout(() => {
      setShow(false)
      setTimeout(onComplete, 500)
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-forest-green-950 via-forest-green-900 to-forest-green-800"
        >
          {/* Grid de fondo animado */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="h-full w-full"
              style={{
                backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '50px 50px']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Círculos orbitales */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute rounded-full border border-vibrant-orange-500/20"
                style={{
                  width: `${300 + i * 100}px`,
                  height: `${300 + i * 100}px`
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: {
                    duration: 20 + i * 5,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* Círculos animados de fondo mejorados */}
            <motion.div
              className="absolute -inset-32 rounded-full bg-vibrant-orange-500/20 blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute -inset-24 rounded-full bg-forest-green-400/20 blur-2xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.5, 0.2],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />

            {/* Contenido principal */}
            <div className="relative space-y-8 text-center">
              {/* Anillo exterior pulsante */}
              <div className="relative mx-auto h-32 w-32">
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-vibrant-orange-500 to-forest-green-400 opacity-30"
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />

                {/* Icono de usuario con animación mejorada */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2,
                  }}
                  className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-vibrant-orange-500 via-vibrant-orange-600 to-vibrant-orange-700 shadow-2xl shadow-vibrant-orange-500/50"
                >
                  {/* Brillo rotante */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  <motion.svg
                    className="relative z-10 h-16 w-16 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </motion.svg>

                  {/* Partículas orbitales alrededor del icono */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={`icon-particle-${i}`}
                      className="absolute h-2 w-2 rounded-full bg-white"
                      style={{
                        top: '50%',
                        left: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos(i * Math.PI / 2) * 80, 0],
                        y: [0, Math.sin(i * Math.PI / 2) * 80, 0],
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Texto de bienvenida con efectos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-3"
              >
                <div className="relative">
                  <motion.h1
                    className="relative z-10 text-5xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    Bienvenido
                  </motion.h1>
                  {/* Resplandor del texto */}
                  <motion.div
                    className="absolute inset-0 text-5xl font-bold text-white blur-xl"
                    animate={{
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Bienvenido
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                  className="relative"
                >
                  <motion.p
                    className="relative z-10 text-3xl font-semibold text-vibrant-orange-400"
                    animate={{
                      textShadow: [
                        "0 0 20px rgba(251, 146, 60, 0.5)",
                        "0 0 30px rgba(251, 146, 60, 0.8)",
                        "0 0 20px rgba(251, 146, 60, 0.5)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {userName}
                  </motion.p>
                </motion.div>
              </motion.div>

              {/* Barra de carga mejorada */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                className="mx-auto w-80 space-y-2"
              >
                <div className="relative h-2 overflow-hidden rounded-full bg-forest-green-700/50 backdrop-blur-sm">
                  {/* Barra de progreso */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-vibrant-orange-500 via-vibrant-orange-400 to-vibrant-orange-500"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  
                  {/* Efecto de brillo que recorre la barra */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ width: '50%' }}
                  />
                </div>
                
                {/* Porcentaje */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-center text-sm font-medium text-vibrant-orange-400"
                >
                  {progress}%
                </motion.div>
              </motion.div>

              {/* Partículas flotantes mejoradas */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: `${-20 + Math.random() * 140}%`,
                    top: `${-20 + Math.random() * 140}%`,
                    width: `${4 + Math.random() * 8}px`,
                    height: `${4 + Math.random() * 8}px`,
                    background: i % 2 === 0 
                      ? 'rgba(251, 146, 60, 0.8)' 
                      : 'rgba(134, 239, 172, 0.8)'
                  }}
                  animate={{
                    y: [0, -50 - Math.random() * 30, 0],
                    x: [0, (Math.random() - 0.5) * 40, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Estrellas parpadeantes */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                >
                  <svg className="h-4 w-4 text-vibrant-orange-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Esquinas decorativas */}
          {[
            { corner: 'top-4 left-4', rotate: 0 },
            { corner: 'top-4 right-4', rotate: 90 },
            { corner: 'bottom-4 left-4', rotate: -90 },
            { corner: 'bottom-4 right-4', rotate: 180 }
          ].map((item, i) => (
            <motion.div
              key={`corner-${i}`}
              className={`absolute ${item.corner}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: 1,
                rotate: item.rotate
              }}
              transition={{
                opacity: {
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                },
                scale: {
                  delay: 0.5,
                  type: "spring"
                }
              }}
            >
              <svg className="h-8 w-8 text-vibrant-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}