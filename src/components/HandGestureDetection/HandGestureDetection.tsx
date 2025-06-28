'use client'
import { useGlobalStore } from '@/store/globalState'
import { GestureRecognizer } from '@mediapipe/tasks-vision'
import { Tooltip } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FaCircleInfo } from 'react-icons/fa6'

export default function HandGestureDetection() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gestureOutput, setGestureOutput] = useState('')
  const [score, setScore] = useState(0)
  const [gestureRecognizer, setGestureRecognizer] = useState<GestureRecognizer | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const animationFrameId = useRef<number | null>(null)
  const { isSwitchOn } = useGlobalStore()

  useEffect(() => {
    const CONFIDENCE_THRESHOLD = 0.6

    const statusValue = score >= CONFIDENCE_THRESHOLD ? 'berhasil' : 'gagal'
    const getTarget = (gesture: string) => {
      switch (gesture) {
        case 'Gesture: Victory':
          return '/'
        case 'Gesture: Open_Palm':
          return '/news'
        case 'Gesture: Pointing_Up':
          return '/type-transportation'
        case 'Gesture: Thumb_Up':
          return '/city'
        case 'Gesture: Thumb_Down':
          return '/transport-operator'
        case 'Gesture: ILoveYou':
          return '/route/Travel'
        case 'Gesture: Closed_Fist':
          return '/schedule/Travel'
        default:
          return ''
      }
    }
    const targetValue = getTarget(gestureOutput)
    const deviceInfo = navigator.userAgent;
    if (gestureOutput) {
      console.log('Gesture type:', gestureOutput, 'Score:', score, 'Status:', statusValue, 'Action Target:', targetValue)
      axios.post('/api/gesture-navigation', {
        gestureType: gestureOutput,
        actionTarget: targetValue ? `Halaman ${targetValue}` : ' - ',
        status: statusValue,
        confidence: score,
        userAgent : deviceInfo,
      })
      if (statusValue === 'berhasil' && targetValue) {
        router.push(targetValue)
      }
    }
  }, [gestureOutput, score, router])

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
          const gestureGroups = results.gestures
          const hasGesture = gestureGroups?.length > 0 && gestureGroups[0]?.length > 0
          if (hasGesture) {
            const gesture = gestureGroups[0][0]
            const newOutput = `Gesture: ${gesture.categoryName}`
            const newOutputScore = Number(gesture.score.toFixed(2))
            setGestureOutput(newOutput)
            setScore(newOutputScore)
          } else {
            setGestureOutput('No gesture detected.')
            setScore(0) 
          }
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

  const text = [
    '✌️ to "/" ',
    '🖐️ to "/news" ',
    '☝️ to "/type-transportation" ',
    '✊ to "/schedule/Travel" ',
    '👎 to "/transport-operator" ',
    '🤟 to "/route/Travel" ',
    '👍 to "/city" ',
  ]

  return (
    <>
      {isSwitchOn && (
        <div className="fixed bottom-4 right-4 z-[998] flex flex-col items-center space-y-2 bg-gray-700/80 dark:bg-gray-900 p-2 rounded-xl shadow-xl backdrop-blur">
          <div className="relative">
            <video ref={videoRef} autoPlay className="rounded-lg shadow-lg" width={280} height={200} />
            <canvas ref={canvasRef} className="absolute top-0 left-0 rounded-lg" width={280} height={200} />
          </div>
          <div className="flex flex-row gap-3 items-center text-white text-sm bg-black/75 px-3 py-1 rounded-lg shadow-md text-center">
            <Tooltip
              placement="topRight"
              title={
                <span>
                  {text.map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>
              }
              className="z-[99999]"
            >
              <FaCircleInfo />
            </Tooltip>
            {gestureOutput}
          </div>
        </div>
      )}
    </>
  )
}
