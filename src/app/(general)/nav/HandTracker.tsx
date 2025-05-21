'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs'
import { getGestureNameAndEmoji } from './getGestureNameAndEmoji'
import { Spin, Switch } from 'antd'

const CAMERA_ID = '9aa39eb51534ff38b20969f5518f01bbedbe973559d2b56d5baec52f1ce20c51'

export default function HandTracker() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false) // 🔹 Default: OFF
  const alertTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastGestureLogTimeRef = useRef<number>(0)
  const modelRef = useRef<handpose.HandPose | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    const setupCamera = async () => {
      try {
        if (videoRef.current) {
          const oldStream = videoRef.current.srcObject as MediaStream | null
          if (oldStream) {
            oldStream.getTracks().forEach((track) => track.stop())
          }
          const newStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: CAMERA_ID }, width: 640, height: 480 },
          })
          videoRef.current.srcObject = newStream
          await videoRef.current.play()
          console.log('✅ Kamera aktif')
        }
      } catch (err) {
        console.error('Gagal mengakses kamera:', err)
      }
    }
    if (isTracking) {
      setupCamera()
    }
  }, [isTracking])

  useEffect(() => {
    const runHandpose = async () => {
      setLoading(true)
      const model = await handpose.load()
      modelRef.current = model
      setLoading(false)
      const detect = async () => {
        if (!isTracking || !videoRef.current || videoRef.current.readyState !== 4) {
          animationIdRef.current = requestAnimationFrame(detect)
          return
        }
        const predictions = await model.estimateHands(videoRef.current)
        const ctx = canvasRef.current?.getContext('2d')
        if (ctx) ctx.clearRect(0, 0, 640, 480)
        if (predictions.length > 0) {
          const landmarksRaw = predictions[0].landmarks
          const landmarks = landmarksRaw.map((l) => ({ x: l[0], y: l[1], z: l[2] }))
          landmarksRaw.forEach(([x, y]) => {
            if (ctx) {
              ctx.beginPath()
              ctx.arc(x, y, 5, 0, Math.PI * 2)
              ctx.fillStyle = 'blue'
              ctx.fill()
            }
          })
          const gesture = getGestureNameAndEmoji(landmarks)
          if (gesture) {
            if (gesture.name === 'Fist') {
              setAlertMessage(null)
              if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current)
                alertTimeoutRef.current = null
              }
            } else {
              if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current)
              const now = Date.now()
              if (now - lastGestureLogTimeRef.current > 1000) {
                console.log(`${gesture.emoji} Gesture detected: ${gesture.name}`)
                lastGestureLogTimeRef.current = now
              }
            }
          }
        } else {
          setAlertMessage(null)
          if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current)
            alertTimeoutRef.current = null
          }
        }
        animationIdRef.current = requestAnimationFrame(detect)
      }
      detect()
    }
    if (isTracking) {
      runHandpose()
    }
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      if (alertTimeoutRef.current) clearTimeout(alertTimeoutRef.current)
    }
  }, [isTracking])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Tracking:</span>
        <Switch checked={isTracking} onChange={setIsTracking} />
      </div>

      {isTracking && (
        <div className="relative w-[640px] h-[480px] border rounded-lg">
          <video
            ref={videoRef}
            width="640"
            height="480"
            autoPlay
            playsInline
            muted
            className="absolute top-0 left-0 rounded-md bg-black"
          />
          <canvas ref={canvasRef} width="640" height="480" className="absolute top-0 left-0 pointer-events-none" />
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center rounded-md">
              <Spin size="large" tip="Loading model..." />
            </div>
          )}
        </div>
      )}

      {alertMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-yellow-400 text-black rounded shadow-lg font-semibold animate-fade-in">
          {alertMessage}
        </div>
      )}
    </div>
  )
}
