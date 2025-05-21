import { isFist, isOkaySign, isOpenHand, isPeace, isPointing, isRockOn, isThumbsUp } from "./Gestures"

export const GestureEmoji = {
  thumbsUp: '👍',
  peace: '✌️',
  openHand: '🖐️',
  fist: '✊',
  pointing: '☝️',
  rockOn: '🤘',
  okaySign: '👌',
}

export function getGestureNameAndEmoji(landmarks: Array<{x:number, y:number, z:number}>) {
  if (isThumbsUp(landmarks)) return { name: 'Thumbs Up', emoji: GestureEmoji.thumbsUp }
  if (isPeace(landmarks)) return { name: 'Peace', emoji: GestureEmoji.peace }
  if (isOpenHand(landmarks)) return { name: 'Open Hand', emoji: GestureEmoji.openHand }
  if (isPointing(landmarks)) return { name: 'Pointing', emoji: GestureEmoji.pointing }
  if (isRockOn(landmarks)) return { name: 'Rock On', emoji: GestureEmoji.rockOn }
  if (isOkaySign(landmarks)) return { name: 'Okay Sign', emoji: GestureEmoji.okaySign }
  if (isFist(landmarks)) return { name: 'Fist', emoji: GestureEmoji.fist }
  return null
}
