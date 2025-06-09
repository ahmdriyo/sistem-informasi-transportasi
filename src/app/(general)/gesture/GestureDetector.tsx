'use client'

import { useEffect, useRef } from 'react'
import * as handpose from '@tensorflow-models/handpose'
import * as fp from 'fingerpose'
import '@tensorflow/tfjs-backend-webgl'

const gestureStrings: Record<string, string> = {
  thumbs_up: '👍',
  victory: '✌🏻',
  thumbs_down: '👎',
}

const fingerLookupIndices: Record<string, number[]> = {
  thumb: [0, 1, 2, 3, 4],
  indexFinger: [0, 5, 6, 7, 8],
  middleFinger: [0, 9, 10, 11, 12],
  ringFinger: [0, 13, 14, 15, 16],
  pinky: [0, 17, 18, 19, 20],
}

const landmarkColors: Record<string, string> = {
  thumb: 'red',
  indexFinger: 'blue',
  middleFinger: 'yellow',
  ringFinger: 'green',
  pinky: 'pink',
  palmBase: 'white',
}

function createThumbsDownGesture() {
  const thumbsDown = new fp.GestureDescription('thumbs_down')
  thumbsDown.addCurl(fp.Finger.Thumb, fp.FingerCurl.NoCurl)
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.VerticalDown, 1.0)
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownLeft, 0.9)
  thumbsDown.addDirection(fp.Finger.Thumb, fp.FingerDirection.DiagonalDownRight, 0.9)

  ;[fp.Finger.Index, fp.Finger.Middle, fp.Finger.Ring, fp.Finger.Pinky].forEach((finger) => {
    thumbsDown.addCurl(finger, fp.FingerCurl.FullCurl, 0.9)
    thumbsDown.addCurl(finger, fp.FingerCurl.HalfCurl, 0.9)
  })

  return thumbsDown
}

export default function GestureDetector() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const gestureTextRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    const setupCamera = async () => {
      const video = videoRef.current
      if (!video) return

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      })
      video.srcObject = stream
      await new Promise((res) => (video.onloadedmetadata = res))
      video.play()
      return video
    }

    const drawPoint = (x: number, y: number, radius: number, ctx: CanvasRenderingContext2D) => {
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.fill()
    }

    const drawPath = (points: number[][], ctx: CanvasRenderingContext2D, color: string) => {
      ctx.strokeStyle = color
      const region = new Path2D()
      region.moveTo(points[0][0], points[0][1])
      points.slice(1).forEach((point) => region.lineTo(point[0], point[1]))
      ctx.stroke(region)
    }

    const detect = async () => {
      const video = await setupCamera()
      const canvas = canvasRef.current
      if (!video || !canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const model = await handpose.load()
      const GE = new fp.GestureEstimator([
        fp.Gestures.VictoryGesture,
        fp.Gestures.ThumbsUpGesture,
        createThumbsDownGesture(),
      ])

      const detectLoop = async () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        ctx.scale(-1, 1)
        ctx.translate(-canvas.width, 0)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        ctx.restore()

        const predictions = await model.estimateHands(video)
        if (predictions.length > 0) {
          const landmarks = predictions[0].landmarks
          Object.keys(fingerLookupIndices).forEach((finger) => {
            const points = fingerLookupIndices[finger].map((i) => landmarks[i])
            drawPath(points, ctx, landmarkColors[finger])
          })
          landmarks.forEach(([x, y]) => drawPoint(x, y, 3, ctx))
          const keypoints3D = landmarks.map((l, i) => ({
            x: l[0],
            y: l[1],
            z: l[2],
            name: i.toString(),
          }))
          const gesture = await GE.estimate(keypoints3D, 9)
          if (gesture.gestures.length > 0) {
            const result = gesture.gestures.reduce((a, b) => (a.score > b.score ? a : b))
            if (gestureTextRef.current) {
              gestureTextRef.current.textContent = gestureStrings[result.name]
            }
          }
        }

        requestAnimationFrame(detectLoop)
      }

      detectLoop()
    }

    detect()
  }, [])

  return (
    <div style={{ position: 'relative', width: 640, height: 480 }}>
      <canvas ref={canvasRef} width={640} height={480} style={{ position: 'absolute', zIndex: 1 }} />
      <video ref={videoRef} style={{ visibility: 'hidden' }} />
      <h1
        ref={gestureTextRef}
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          fontSize: '3rem',
          color: 'white',
          zIndex: 2,
        }}
      ></h1>
    </div>
  )
}
