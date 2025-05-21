//  '👍'
export function isThumbsUp(landmarks: Array<{x:number, y:number, z:number}>): boolean {
  const wrist = landmarks[0]
  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const isThumbUp = thumbTip.y < wrist.y 
  const areFingersFolded = [indexTip, middleTip, ringTip, pinkyTip].every(finger => finger.y > wrist.y + 0.05)

  return isThumbUp && areFingersFolded
}

export function isPeace(landmarks: Array<{x:number, y:number, z:number}>): boolean {
  const wrist = landmarks[0]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]

  const indexUp = indexTip.y < wrist.y
  const middleUp = middleTip.y < wrist.y
  const ringDown = ringTip.y > wrist.y
  const pinkyDown = pinkyTip.y > wrist.y

  return indexUp && middleUp && ringDown && pinkyDown
}
// '🖐️'
export function isOpenHand(landmarks: Array<{x:number, y:number, z:number}>): boolean {
  const wrist = landmarks[0]
  return [4,8,12,16,20].every(i => landmarks[i].y < wrist.y)
}


// '✊'
export function isFist(landmarks: Array<{ x: number, y: number, z: number }>): boolean {
  // Indeks PIP untuk tiap jari (sendi tengah jari)
  const pipIndices = [3, 7, 11, 15, 19]
  const tipIndices = [4, 8, 12, 16, 20]

  // Cek tiap jari apakah ujung (tip) lebih dekat ke wrist daripada PIP dalam sumbu y (vertikal)
  // Artinya jari menekuk
  const fistDetected = tipIndices.every((tipIdx, i) => {
    const pipIdx = pipIndices[i]
    return landmarks[tipIdx].y > landmarks[pipIdx].y
  })

  return fistDetected
}



export function isPointing(landmarks: Array<{x:number, y:number, z:number}>): boolean {
  const wrist = landmarks[0]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]
  const thumbTip = landmarks[4]

  const indexUp = indexTip.y < wrist.y
  // Jari selain telunjuk "ditekuk"
  const othersFolded = [middleTip, ringTip, pinkyTip, thumbTip].every(finger => finger.y > wrist.y)
  return indexUp && othersFolded
}

export function isRockOn(landmarks: Array<{x:number, y:number, z:number}>): boolean {
  const wrist = landmarks[0]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]
  const threshold = 10
  const indexUp = indexTip.y < wrist.y - threshold
  const pinkyUp = pinkyTip.y < wrist.y - threshold
  const middleDown = middleTip.y > wrist.y + threshold
  const ringDown = ringTip.y > wrist.y + threshold
  return indexUp && pinkyUp && middleDown && ringDown
}

export function isOkaySign(landmarks: Array<{ x: number, y: number, z: number }>): boolean {
  const thumbTip = landmarks[4]
  const indexTip = landmarks[8]
  const middleTip = landmarks[12]
  const ringTip = landmarks[16]
  const pinkyTip = landmarks[20]
  const distanceThumbIndex = Math.sqrt(
    Math.pow(thumbTip.x - indexTip.x, 2) +
    Math.pow(thumbTip.y - indexTip.y, 2)
  )
  const threshold = 0.1 
  const middleUp = middleTip.y < indexTip.y
  const ringUp = ringTip.y < indexTip.y
  const pinkyUp = pinkyTip.y < indexTip.y
  return distanceThumbIndex < threshold && middleUp && ringUp && pinkyUp
}
