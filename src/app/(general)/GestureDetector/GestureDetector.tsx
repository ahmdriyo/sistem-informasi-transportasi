import { useEffect, useRef } from "react";
import * as handpose from "@tensorflow-models/handpose";
import { GestureEstimator } from "fingerpose";
import { ThumbsUpGesture, VictoryGesture, OkGesture } from "./estures";

export default function GestureDetector() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      runHandpose();
    }
  }, []);

  async function runHandpose() {
    // Muat model Handpose
    const model = await handpose.load();
    console.log("Model Handpose berhasil dimuat!");

    // Setup Fingerpose dengan gestur yang diinginkan
    const GE = new GestureEstimator([
      ThumbsUpGesture,
      VictoryGesture,
      OkGesture,
    ]);

    // Akses webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;

      detectGestures(model, GE);
    }
  }

  async function detectGestures(model, GE) {
    if (
      !videoRef.current ||
      videoRef.current.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA
    ) {
      requestAnimationFrame(() => detectGestures(model, GE));
      return;
    }

    // Prediksi posisi tangan
    const predictions = await model.estimateHands(videoRef.current);
    
    if (predictions.length > 0) {
      // Estimasi gestur menggunakan Fingerpose
      const estimatedGestures = GE.estimate(
        predictions[0].landmarks,
        8 // Confidence threshold
      );

      // Log hasil deteksi ke console
      console.log("Hasil Deteksi Gestur:", estimatedGestures.gestures);
    }

    requestAnimationFrame(() => detectGestures(model, GE));
  }

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ width: "640px", height: "480px" }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}