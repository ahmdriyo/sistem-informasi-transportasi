'use client'

import React, { useRef, useEffect } from 'react'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs-backend-webgl'
import * as fp from 'fingerpose'
import Webcam from 'react-webcam'
import '@tensorflow/tfjs-backend-webgl'; // or '@tensorflow/tfjs-backend-cpu'
import * as tf from '@tensorflow/tfjs';
import { ThumbsUpGesture, VictoryGesture } from './gestures'

await tf.setBackend('webgl'); // atau 'cpu'
await tf.ready(); 

const HandposeDetection = () => {
  const webcamRef = useRef<Webcam>(null)

  useEffect(() => {
    const runHandpose = async () => {
      // Set backend dulu
      await tf.setBackend('webgl')
      await tf.ready()

      const net = await handpose.load()
      console.log('🧠 Model loaded ✅')

      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video as HTMLVideoElement
          const hand = await net.estimateHands(video)

          if (hand.length > 0) {
            const GE = new fp.GestureEstimator([
              ThumbsUpGesture,
              VictoryGesture,
            ])

            const landmarks = hand[0].landmarks.map((point) => ({
              x: point[0],
              y: point[1],
              z: point[2],
            }))

            const gesture = await GE.estimate(landmarks, 7.5)

           if (gesture.gestures && gesture.gestures.length > 0) {
  const gestures: any[] = gesture.gestures // 👈 kasih tahu TypeScript ini array of any dulu

  const maxConfidenceGesture = gestures.reduce((prev, current) =>
    prev.confidence > current.confidence ? prev : current
  )

  console.log('🎯 Gesture Detected:', maxConfidenceGesture.name)
}

          }
        }

        requestAnimationFrame(detect)
      }

      detect()
    }

    runHandpose()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Webcam
        ref={webcamRef}
        audio={false}
        mirrored={true}
        style={{
          width: 640,
          height: 480,
          borderRadius: 16,
          border: '2px solid #ccc',
        }}
        videoConstraints={{
          deviceId: '9aa39eb51534ff38b20969f5518f01bbedbe973559d2b56d5baec52f1ce20c51', // id kamera kamu
        }}
      />
      <p className="mt-4 text-sm text-gray-500">Arahkan tangan ke kamera untuk deteksi gesture 🤖</p>
    </div>
  )
}

export default HandposeDetection
