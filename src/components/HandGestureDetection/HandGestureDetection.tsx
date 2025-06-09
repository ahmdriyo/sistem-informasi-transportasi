'use client'
import { useGlobalStore } from '@/store/globalState'
import { GestureRecognizer } from '@mediapipe/tasks-vision'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function HandGestureDetection() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gestureOutput, setGestureOutput] = useState('')
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const { isSwitchOn } = useGlobalStore()

  useEffect(() => {
    if (!gestureOutput) return

    switch (gestureOutput) {
      case 'Gesture: Victory':
        router.push('/')
        break
      case 'Gesture: Open_Palm':
        router.push('/news')
        break
      case 'Gesture: Pointing_Up':
        router.push('/type-transportation')
        break
      case 'Gesture: Thumb_Up':
        router.push('/city')
        break
      case 'Gesture: Thumb_Down':
        router.push('/transport-operator')
        break
      case 'Gesture: ILoveYou':
        router.push('/route/Travel')
        break
      case 'Gesture: Closed_Fist':
        router.push('/schedule/Travel')
        break
    }
  }, [gestureOutput, router])

  useEffect(() => {
    const loadRecognizer = async () => {
      const vision = await (
        await import('@mediapipe/tasks-vision')
      ).FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm')

      const recognizer = await (
        await import('@mediapipe/tasks-vision')
      ).GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
      })
      setGestureRecognizer(recognizer)
    }
    loadRecognizer()
  }, [])

  useEffect(() => {
    if (!gestureRecognizer || !isSwitchOn) return

    const enableCam = async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
        videoRef.current.addEventListener('loadeddata', predictWebcam)
      }
    }

    let lastVideoTime = -1
    let lastGestureUpdate = 0

    const predictWebcam = async () => {
      if (!gestureRecognizer || !videoRef.current || !canvasRef.current) return

      const nowInMs = Date.now()
      if (videoRef.current.currentTime !== lastVideoTime) {
        lastVideoTime = videoRef.current.currentTime
        const results = await gestureRecognizer.recognizeForVideo(videoRef.current, nowInMs)

        const canvasCtx = canvasRef.current.getContext('2d')
        canvasCtx?.save()
        canvasCtx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        const DrawingUtils = (await import('@mediapipe/tasks-vision')).DrawingUtils
        const drawingUtils = new DrawingUtils(canvasCtx!)

        if (results.landmarks) {
          for (const landmarks of results.landmarks) {
            drawingUtils.drawConnectors(
              landmarks,
              (await import('@mediapipe/tasks-vision')).GestureRecognizer.HAND_CONNECTIONS,
              { color: '#ecc25e', lineWidth: 2 },
            )
            drawingUtils.drawLandmarks(landmarks, { color: '#0e1df5', lineWidth: 0.1 })
          }
        }
        canvasCtx?.restore()
        if (nowInMs - lastGestureUpdate >= 5000) {
          const detected = results.gestures.length > 0
          const newOutput = detected ? `Gesture: ${results.gestures[0][0].categoryName}` : 'No gesture detected.'
          setGestureOutput(newOutput)
          lastGestureUpdate = nowInMs
        }
      }
      animationFrameId.current = window.requestAnimationFrame(predictWebcam)
    }

    enableCam()
    return () => {
      if (animationFrameId.current) window.cancelAnimationFrame(animationFrameId.current)
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.srcObject = null
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
        setStream(null)
      }
    }
  }, [gestureRecognizer, isSwitchOn])

  return (
    <>
      {isSwitchOn && (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-center space-y-2 bg-gray-700/80 dark:bg-gray-900 p-2 rounded-xl shadow-xl backdrop-blur">
          <div className="relative">
            <video ref={videoRef} autoPlay className="rounded-lg shadow-lg" width={280} height={200} />
            <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-lg" width={280} height={200} />
          </div>
          <div className="text-white text-sm bg-black/75 px-3 py-1 rounded-lg shadow-md text-center">
            {gestureOutput}
          </div>
        </div>
      )}
    </>
  )
}
